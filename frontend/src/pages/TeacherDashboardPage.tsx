import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomSubmissions, getClassroomById, ClassroomSubmission, Classroom } from '../services/classroomService';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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

  // Load classroom details and submissions
  useEffect(() => {
    const loadClassroomData = async () => {
      if (!classroomId || !user?.uid) return;

      try {
        setLoading(true);
        
        // Load classroom details
        const classroomData = await getClassroomById(classroomId);
        
        if (!classroomData) {
          setError('Classroom not found');
          return;
        }
        
        // Check if current user is the teacher
        if (classroomData.teacherId !== user.uid) {
          setError('You do not have permission to view this classroom');
          return;
        }
        
        setClassroom(classroomData);

        // Load submissions
        const classroomSubmissions = await getClassroomSubmissions(classroomId);
        const db = getFirestore(app);

        // Enrich submissions with student display names
        const submissionsWithDetails: SubmissionWithStudentDetails[] = await Promise.all(
          classroomSubmissions.map(async (sub) => {
            try {
              const userDocRef = doc(db, 'users', sub.studentId);
              const userDocSnap = await getDoc(userDocRef);
              const studentData = userDocSnap.data();
              return {
                ...sub,
                studentDisplayName: studentData?.displayName || studentData?.email || `Student ${sub.studentId.slice(-6)}`,
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

        setSubmissions(submissionsWithDetails);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load classroom data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadClassroomData();
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
          <p>📍 Code: <strong>{classroom?.classKey}</strong> | 👥 Students: {classroom?.students.length || 0}</p>
        </div>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>📤 Submissions Received</h3>
            <div className="stat-value">{submissions.length}</div>
          </div>
          <div className="stat-card">
            <h3>📈 Average Score</h3>
            <div className="stat-value" style={{ color: getScoreColor(averageScore) }}>
              {averageScore}%
            </div>
          </div>
          <div className="stat-card">
            <h3>🎯 Excellent (80%+)</h3>
            <div className="stat-value">{distribution.excellent}</div>
          </div>
          <div className="stat-card">
            <h3>⚠️ Needs Improvement (&lt;60%)</h3>
            <div className="stat-value">{distribution.needsImprovement}</div>
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