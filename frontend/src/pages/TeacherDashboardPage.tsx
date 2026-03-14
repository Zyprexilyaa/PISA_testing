import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomSubmissions, getClassroomById, ClassroomSubmission, Classroom } from '../services/classroomService';
import { getFirestore, doc, getDoc, onSnapshot, query, collection, where } from 'firebase/firestore';
import app from '../services/firebase';
import './Classroom.css';

interface SubmissionWithStudentDetails extends ClassroomSubmission {
  studentDisplayName?: string;
}

export const TeacherDashboardPage: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionWithStudentDetails[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not teacher
  useEffect(() => {
    if (userRole && userRole !== 'teacher') {
      navigate('/');
    }
  }, [userRole, navigate]);

  // Load classroom details and setup real-time submissions listener
  useEffect(() => {
    if (!classroomId || !user?.uid) return;

    let unsubscribe: () => void;

    const setupDashboard = async () => {
      try {
        setLoading(true);
        
        // Load classroom details
        const classroomData = await getClassroomById(classroomId);
        
        if (!classroomData) {
          setError('Classroom not found');
          setLoading(false);
          return;
        }
        
        // Check if current user is the teacher
        if (classroomData.teacherId !== user.uid) {
          setError('You do not have permission to view this classroom');
          setLoading(false);
          return;
        }
        
        setClassroom(classroomData);

        // Setup real-time listener for submissions
        const db = getFirestore(app);
        const q = query(collection(db, 'classroomSubmissions'), where('classroomId', '==', classroomId));
        
        unsubscribe = onSnapshot(q, async (snapshot) => {
          const newSubmissions: ClassroomSubmission[] = [];
          snapshot.forEach((doc) => {
            newSubmissions.push({
              id: doc.id,
              ...doc.data(),
              submittedAt: doc.data().submittedAt.toDate(),
            } as ClassroomSubmission);
          });

          // Enrich with student details
          const submissionsWithDetails = await Promise.all(
            newSubmissions.map(async (sub) => {
              try {
                const userDocRef = doc(db, 'users', sub.studentId);
                const userDocSnap = await getDoc(userDocRef);
                const studentData = userDocSnap.data();
                return {
                  ...sub,
                  studentDisplayName: studentData?.username || studentData?.displayName || studentData?.email || `Student ${sub.studentId.slice(-6)}`,
                };
              } catch (err) {
                console.error('Error fetching student details:', err);
                return {
                  ...sub,
                  studentDisplayName: `Student ${sub.studentId.slice(-6)}`,
                };
              }
            })
          );

          // Sort by submittedAt descending
          submissionsWithDetails.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
          
          setSubmissions(submissionsWithDetails);
          setLoading(false);
        }, (err) => {
          console.error("Error in real-time listener:", err);
          setError("Failed to sync live data");
          setLoading(false);
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load classroom data';
        setError(errorMessage);
        setLoading(false);
      }
    };

    setupDashboard();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [classroomId, user?.uid]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getAverageScore = () => {
    if (submissions.length === 0) return 0;
    const total = submissions.reduce((sum, sub) => sum + sub.score, 0);
    return Math.round(total / submissions.length);
  };

  const getScoreDistribution = () => {
    const ranges = { excellent: 0, good: 0, needsImprovement: 0 };
    submissions.forEach(sub => {
      if (sub.score >= 80) ranges.excellent++;
      else if (sub.score >= 60) ranges.good++;
      else ranges.needsImprovement++;
    });
    return ranges;
  };

  // Calculate completion rate if we knew total students
  const completionRate = classroom?.students?.length 
    ? Math.round((submissions.length / classroom.students.length) * 100) 
    : 0;

  if (userRole !== 'teacher') {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="classroom-page">
        <div className="classroom-container">
          <div className="loading">Loading classroom data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="classroom-page">
        <div className="classroom-container">
          <div className="error-alert">{error}</div>
          <button onClick={() => navigate('/create-classroom')} className="btn btn-outline">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const averageScore = getAverageScore();
  const distribution = getScoreDistribution();

  return (
    <div className="classroom-page">
      <div className="classroom-container">
        <div className="classroom-header">
          <h1>📊 {classroom?.className || 'Classroom'} Dashboard</h1>
          <p>
            📍 Code: <strong>{classroom?.classKey}</strong> 
            <span style={{margin: '0 10px'}}>|</span> 
            👤 Owner: <strong>{classroom?.teacherName || classroom?.ownerName || 'You'}</strong>
          </p>
        </div>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>📤 Submissions</h3>
            <div className="stat-value">{submissions.length} <small style={{fontSize: '0.5em', color: '#666'}}>/ {classroom?.students?.length || 0}</small></div>
          </div>
          <div className="stat-card">
            <h3>� Completion</h3>
            <div className="stat-value">{completionRate}%</div>
          </div>
          <div className="stat-card">
            <h3>📈 Avg Score</h3>
            <div className="stat-value" style={{ color: getScoreColor(averageScore) }}>
              {averageScore}%
            </div>
          </div>
          <div className="stat-card">
            <h3>🎯 Excellent</h3>
            <div className="stat-value" style={{color: '#4CAF50'}}>{distribution.excellent}</div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="classroom-card">
          <h2>📝 Student Submissions</h2>
          {submissions.length === 0 ? (
            <p className="no-submissions">No submissions yet. Students need to complete quizzes in this classroom.</p>
          ) : (
            <div className="submissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Question</th>
                    <th>Score</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>
                        <div className="student-info">
                          <strong>{submission.studentDisplayName}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="question-preview">
                          {submission.questionText.length > 50
                            ? `${submission.questionText.substring(0, 50)}...`
                            : submission.questionText
                          }
                        </div>
                      </td>
                      <td>
                        <span
                          className="score-badge"
                          style={{ backgroundColor: getScoreColor(submission.score) }}
                        >
                          {submission.score}%
                        </span>
                      </td>
                      <td>{submission.submittedAt.toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => navigate(`/submission/${submission.id}`)}
                          className="btn btn-small"
                        >
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="classroom-footer">
          <button onClick={() => navigate('/create-classroom')} className="btn btn-outline">
            ← Back to My Classrooms
          </button>
        </div>
      </div>
    </div>
  );
};
