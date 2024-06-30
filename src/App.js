import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import MatchList from './MatchList';
import MatchAnalysis from './MatchAnalysis';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [tag, setTag] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/get_matches/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game_name: playerName, tag_line: tag }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMatches(data.match_ids);
      navigate('/matches', { state: { matches: data.match_ids, playerName, tag } });
    } catch (error) {
      setError(error.toString());
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Player Name:
            <input
              type="text"
              placeholder="Enter Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Tag:
            <input
              type="text"
              placeholder="Enter Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/matches" element={<MatchList />} />
        <Route path="/analysis" element={<MatchAnalysis />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
