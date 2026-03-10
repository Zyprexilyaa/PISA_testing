import React, { useEffect, useState } from 'react';
import { getPropositions, PropositionData } from '../services/propositionService';
import { Link } from 'react-router-dom';
import './Auth.css';

export const TeacherPropositionListPage: React.FC = () => {
  const [propsList, setPropsList] = useState<PropositionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const p = await getPropositions('th');
      setPropsList(p);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <h2 className="auth-subtitle">Your Propositions</h2>

          <div className="teacher-actions">
            <Link to="/teacher/propositions/new" className="btn btn-primary">Add New Proposition</Link>
          </div>

          {loading && <div>Loading...</div>}

          {!loading && (
            <div className="proposition-list">
              {propsList.map((p, idx) => (
                <div key={idx} className="proposition-item">
                  <h4>{p.questionText}</h4>
                  <div className="proposition-meta">{p.category} • {p.difficulty}</div>
                  <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button className="btn btn-outline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
