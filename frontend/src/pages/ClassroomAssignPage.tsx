import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Classroom, getClassroomById, updateClassroomAssignments } from '../services/classroomService';
import { getPropositions, PropositionData } from '../services/propositionService';
import './Classroom.css';

export const ClassroomAssignPage: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [propositions, setPropositions] = useState<PropositionData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!classroomId) {
        setError('Missing classroom id');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const cls = await getClassroomById(classroomId);
        setClassroom(cls);
        const props = await getPropositions('th');
        setPropositions(props);
        if (cls?.assignedPropositionIds) {
          setSelectedIds(cls.assignedPropositionIds);
        }
      } catch (err) {
        console.error('Error loading assignment data', err);
        setError('Failed to load classroom or propositions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [classroomId]);

  if (userRole && userRole !== 'teacher') {
    return (
      <div className="classroom-page">
        <div className="classroom-container">
          <div className="error-alert">Only teachers can assign problems to classrooms.</div>
        </div>
      </div>
    );
  }

  const toggleSelection = (id?: string) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!classroomId) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await updateClassroomAssignments(classroomId, selectedIds);
      setSuccess('Assignments saved successfully.');
    } catch (err) {
      console.error('Error saving assignments', err);
      setError('Failed to save assignments');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="classroom-page">
      <div className="classroom-container">
        <div className="classroom-header">
          <h1>📚 Assign Problems</h1>
          <p>
            {classroom
              ? `Classroom: ${classroom.className}`
              : 'Loading classroom information...'}
          </p>
        </div>

        <div className="classroom-card">
          {loading && <div className="loading">Loading propositions...</div>}

          {!loading && error && <div className="error-alert">{error}</div>}
          {!loading && success && <div className="success-alert">{success}</div>}

          {!loading && !error && (
            <>
              <p>Select which problems you want students in this classroom to solve.</p>
              <div className="classroom-list">
                {propositions.map((p) => (
                  <label
                    key={p.id}
                    className="classroom-item"
                    style={{ cursor: 'pointer', alignItems: 'flex-start' }}
                  >
                    <div className="classroom-info">
                      <h3>{p.questionText.substring(0, 120)}{p.questionText.length > 120 ? '...' : ''}</h3>
                      <p>
                        <strong>Category:</strong> {p.category} • <strong>Difficulty:</strong> {p.difficulty}
                      </p>
                    </div>
                    <div className="classroom-actions">
                      <input
                        type="checkbox"
                        checked={!!(p.id && selectedIds.includes(p.id))}
                        onChange={() => toggleSelection(p.id)}
                      />
                    </div>
                  </label>
                ))}
              </div>

              <div className="classroom-footer">
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Assignments'}
                </button>
                <button
                  onClick={() => navigate('/create-classroom')}
                  className="btn btn-outline"
                  style={{ marginLeft: '0.75rem' }}
                >
                  ← Back to classrooms
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

