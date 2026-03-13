import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createClassroom, getTeacherClassrooms, Classroom } from '../services/classroomService';
import './Classroom.css';

export const CreateClassroomPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [className, setClassName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingClassrooms, setExistingClassrooms] = useState<Classroom[]>([]);

  // Redirect if not teacher
  useEffect(() => {
    if (userRole && userRole !== 'teacher') {
      navigate('/');
    }
  }, [userRole, navigate]);

  // Load existing classrooms
  useEffect(() => {
    const loadClassrooms = async () => {
      if (user?.uid) {
        try {
          const classrooms = await getTeacherClassrooms(user.uid);
          setExistingClassrooms(classrooms);
        } catch (error) {
          console.error('Error loading classrooms:', error);
        }
      }
    };

    loadClassrooms();
  }, [user?.uid]);

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!className.trim()) {
      setError('Please enter a classroom name');
      return;
    }

    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    setIsCreating(true);

    try {
      const classroom = await createClassroom(user.uid, className.trim());
      setSuccess(`Classroom "${classroom.className}" created! Join code: ${classroom.classKey}`);
      setClassName('');

      // Refresh classroom list
      const updatedClassrooms = await getTeacherClassrooms(user.uid);
      setExistingClassrooms(updatedClassrooms);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create classroom';
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  if (userRole !== 'teacher') {
    return <div>Loading...</div>;
  }

  return (
    <div className="classroom-page">
      <div className="classroom-container">
        <div className="classroom-header">
          <h1>👩‍🏫 Teacher Dashboard</h1>
          <p>Create and manage your classrooms</p>
        </div>

        {/* Create New Classroom */}
        <div className="classroom-card">
          <h2>📚 Create New Classroom</h2>
          <form onSubmit={handleCreateClassroom} className="create-form">
            <div className="form-group">
              <label htmlFor="className">Classroom Name</label>
              <input
                id="className"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g., Math Class 2024"
                disabled={isCreating}
                className="form-input"
              />
            </div>

            {error && <div className="error-alert">{error}</div>}
            {success && <div className="success-alert">{success}</div>}

            <button
              type="submit"
              disabled={isCreating || !className.trim()}
              className="btn btn-primary"
            >
              {isCreating ? '🔄 Creating...' : '➕ Create Classroom'}
            </button>
          </form>
        </div>

        {/* Existing Classrooms */}
        <div className="classroom-card">
          <h2>🏫 Your Classrooms</h2>
          {existingClassrooms.length === 0 ? (
            <p className="no-classrooms">No classrooms created yet. Create your first classroom above!</p>
          ) : (
            <div className="classroom-list">
              {existingClassrooms.map((classroom) => (
                <div key={classroom.id} className="classroom-item">
                  <div className="classroom-info">
                    <h3>{classroom.className}</h3>
                    <p><strong>Join Code:</strong> <code>{classroom.classKey}</code></p>
                    <p><strong>Students:</strong> {classroom.students.length}</p>
                    <p><strong>Created:</strong> {classroom.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="classroom-actions">
                    <button
                      onClick={() => navigate(`/teacher-dashboard/${classroom.id}`)}
                      className="btn btn-secondary"
                    >
                      📊 View Details
                    </button>
                    <button
                      onClick={() => navigate(`/classroom/${classroom.id}/assign`)}
                      className="btn btn-primary"
                      style={{ marginLeft: '0.5rem' }}
                    >
                      📝 Assign Problems
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