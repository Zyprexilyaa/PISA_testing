import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomById, Classroom } from '../services/classroomService';
import { getPropositions, PropositionData } from '../services/propositionService';
import './Classroom.css';

export const ClassroomContestPage: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignedProps, setAssignedProps] = useState<PropositionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!classroomId) {
        setError('Missing classroomId');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const cls = await getClassroomById(classroomId);
        setClassroom(cls);

        if (!cls || !cls.assignedPropositionIds || cls.assignedPropositionIds.length === 0) {
          setAssignedProps([]);
          return;
        }

        const all = await getPropositions('th');
        const filtered = all.filter(p => p.id && cls.assignedPropositionIds!.includes(p.id));
        setAssignedProps(filtered);
      } catch (err) {
        console.error('Error loading classroom contest data', err);
        setError('Failed to load classroom problems');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classroomId]);

  if (userRole && userRole !== 'student') {
    return (
      <div className="classroom-page">
        <div className="classroom-container">
          <div className="error-alert">This view is for students only.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="classroom-page">
      <div className="classroom-container">
        <div className="classroom-header">
          <h1>📝 Classroom Problems</h1>
          <p>
            {classroom
              ? `Classroom: ${classroom.className}`
              : 'Loading classroom information...'}
          </p>
        </div>

        {loading && (
          <div className="classroom-card">
            <div className="loading">Loading assigned problems...</div>
          </div>
        )}

        {!loading && error && (
          <div className="classroom-card">
            <div className="error-alert">{error}</div>
          </div>
        )}

        {!loading && !error && assignedProps.length === 0 && (
          <div className="classroom-card">
            <p className="no-classrooms">
              Your teacher has not assigned any problems yet. Please check back later.
            </p>
          </div>
        )}

        {!loading && !error && assignedProps.length > 0 && (
          <div className="classroom-card">
            <h2>📚 Assigned Problems</h2>
            <div className="classroom-list">
              {assignedProps.map((p) => (
                <div key={p.id} className="classroom-item">
                  <div className="classroom-info">
                    <h3>{p.questionText.substring(0, 120)}{p.questionText.length > 120 ? '...' : ''}</h3>
                    <p>
                      <strong>Category:</strong> {p.category} • <strong>Difficulty:</strong> {p.difficulty}
                    </p>
                  </div>
                  <div className="classroom-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/classroom/${classroomId}/problem/${p.id}`)}
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="classroom-footer">
          <button onClick={() => navigate('/home')} className="btn btn-outline">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

