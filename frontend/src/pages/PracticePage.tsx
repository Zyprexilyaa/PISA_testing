import React, { useEffect, useState } from 'react';
import { getPropositions, PropositionData, getRandomProposition } from '../services/propositionService';
import './Auth.css';
import { Link } from 'react-router-dom';

export const PracticePage: React.FC = () => {
  const [propositions, setPropositions] = useState<PropositionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PropositionData | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const props = await getPropositions('th');
      setPropositions(props);
      setLoading(false);
    };
    load();
  }, []);

  const pickRandom = async () => {
    setLoading(true);
    const p = await getRandomProposition('th');
    setSelected(p);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <h2 className="auth-subtitle">Practice Propositions</h2>

          <div className="teacher-actions">
            <button onClick={pickRandom} className="btn btn-primary" style={{marginRight:8}}>Pick Random</button>
            <Link to="/" className="btn btn-outline">Back Home</Link>
          </div>

          {loading && <div>Loading propositions...</div>}

          {!loading && !selected && (
            <div>
              <h3>Available Propositions</h3>
              <div className="proposition-list">
                {propositions.map((p, idx) => (
                  <div key={idx} className="proposition-item">
                    <h4>{p.questionText.substring(0,120)}{p.questionText.length>120? '...':''}</h4>
                    <div className="proposition-meta">{p.category} • {p.difficulty}</div>
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                      <button className="btn btn-outline" onClick={() => setSelected(p)}>Practice</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected && (
            <div>
              <h3>Practice</h3>
              <p><strong>Question:</strong> {selected.questionText}</p>
              <p><strong>Expected answer:</strong> {selected.expectedAnswer}</p>

              <div className="practice-actions">
                <button onClick={() => setSelected(null)} className="btn btn-outline">Back to list</button>
                <button onClick={() => { alert('Start practice flow (not implemented yet)'); }} className="btn btn-primary">Start Practice</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
