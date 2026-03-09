import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { joinClassroom, getStudentClassrooms, Classroom } from '../services/classroomService';
import './Classroom.css';

export const JoinClassroomPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [classKey, setClassKey] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [joinedClassrooms, setJoinedClassrooms] = useState<Classroom[]>([]);

  // Redirect if not student
  useEffect(() => {
    if (userRole && userRole !== 'student') {
      navigate('/');
    }
  }, [userRole, navigate]);

  // Load joined classrooms
  useEffect(() => {
    const loadClassrooms = async () => {
      if (user?.uid) {
        try {
          const classrooms = await getStudentClassrooms(user.uid);
          setJoinedClassrooms(classrooms);
        } catch (error) {
          console.error('Error loading classrooms:', error);
        }
      }
    };

    loadClassrooms();
  }, [user?.uid]);

  const handleJoinClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!classKey.trim()) {
      setError('Please enter a classroom code');
      return;
    }

    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    setIsJoining(true);

    try {
      const classroom = await joinClassroom(user.uid, classKey.trim().toUpperCase());
      if (classroom) {
        setSuccess(`Successfully joined "${classroom.className}"!`);
      } else {
        setSuccess('Successfully joined classroom!');
      }

      // Refresh classroom list
      const updatedClassrooms = await getStudentClassrooms(user.uid);
      setJoinedClassrooms(updatedClassrooms);
      setClassKey('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join classroom';
      setError(errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  if (userRole !== 'student') {
    return <div>Loading...</div>;
  }

  return (
    <div className="classroom-page">
      <div className="classroom-container">
        <div className="classroom-header">
          <h1>🎓 Student Dashboard</h1>
          <p>Join classrooms and complete assignments</p>
        </div>

        {/* Join Classroom */}
        <div className="classroom-card">
          <h2>🚪 Join Classroom</h2>
          <form onSubmit={handleJoinClassroom} className="join-form">
            <div className="form-group">
              <label htmlFor="classKey">Classroom Code</label>
              <input
                id="classKey"
                type="text"
                value={classKey}
                onChange={(e) => setClassKey(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code (e.g., ABC123)"
                maxLength={6}
                disabled={isJoining}
                className="form-input"
              />
              <small className="form-hint">Ask your teacher for the classroom code</small>
            </div>

            {error && <div className="error-alert">{error}</div>}
            {success && <div className="success-alert">{success}</div>}

            <button
              type="submit"
              disabled={isJoining || classKey.length !== 6}
              className="btn btn-primary"
            >
              {isJoining ? '🔄 Joining...' : '🚪 Join Classroom'}
            </button>
          </form>
        </div>

        {/* Joined Classrooms */}
        <div className="classroom-card">
          <h2>📚 Your Classrooms</h2>
          {joinedClassrooms.length === 0 ? (
            <p className="no-classrooms">No classrooms joined yet. Enter a classroom code above to join!</p>
          ) : (
            <div className="classroom-list">
              {joinedClassrooms.map((classroom) => (
                <div key={classroom.id} className="classroom-item">
                  <div className="classroom-info">
                    <h3>{classroom.className}</h3>
                    <p><strong>Teacher:</strong> {classroom.teacherName || 'Unknown'}</p>
                    <p><strong>Joined:</strong> {classroom.joinedAt?.toLocaleDateString() || 'Recently'}</p>
                  </div>
                  <div className="classroom-actions">
                    <button
                      onClick={() => navigate(`/classroom/${classroom.id}`)}
                      className="btn btn-secondary"
                    >
                      📝 Take Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="classroom-footer">
          <button onClick={() => navigate('/')} className="btn btn-outline">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};