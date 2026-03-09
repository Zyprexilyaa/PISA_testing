import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomSubmissions, ClassroomSubmission } from '../services/classroomService';
import './Classroom.css';

interface SubmissionWithDetails extends ClassroomSubmission {
  studentName?: string;
  studentEmail?: string;
}

export const TeacherDashboardPage: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classroomName, setClassroomName] = useState<string>('');

  // Redirect if not teacher
  useEffect(() => {
    if (userRole && userRole !== 'teacher') {
      navigate('/');
    }
  }, [userRole, navigate]);

  // Load classroom submissions
  useEffect(() => {
    const loadSubmissions = async () => {
      if (!classroomId || !user?.uid) return;

      try {
        setLoading(true);
        const classroomSubmissions = await getClassroomSubmissions(classroomId);

        // For now, we'll use student IDs as names (in a real app, you'd fetch user details)
        const submissionsWithDetails: SubmissionWithDetails[] = classroomSubmissions.map(sub => ({
          ...sub,
          studentName: `Student ${sub.studentId.slice(-4)}`, // Last 4 chars of ID
          studentEmail: `${sub.studentId.slice(-4)}@student.edu` // Mock email
        }));

        setSubmissions(submissionsWithDetails);

        // Set classroom name from first submission if available
        if (submissionsWithDetails.length > 0 && submissionsWithDetails[0].classroomName) {
          setClassroomName(submissionsWithDetails[0].classroomName);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load submissions';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
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
          <h1>📊 {classroomName || 'Classroom'} Dashboard</h1>
          <p>View student submissions and performance</p>
        </div>

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>👥 Total Students</h3>
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
                          <strong>{submission.studentName}</strong>
                          <small>{submission.studentEmail}</small>
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