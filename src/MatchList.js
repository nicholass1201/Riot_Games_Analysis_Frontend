import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

function MatchList() {
  const location = useLocation();
  const { matches, playerName, tag } = location.state;
  const navigate = useNavigate();

  const handleAnalyze = (index) => {
    navigate('/analysis', { state: { index, playerName, tag } });
  };

  return (
    <div className="container">
      <h2>Match List</h2>
      <ul>
        {matches.map((matchId, index) => (
          <li key={index}>
            {matchId} <button onClick={() => handleAnalyze(index)}>Analyze</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MatchList;
