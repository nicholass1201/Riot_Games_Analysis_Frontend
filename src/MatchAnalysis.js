import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function MatchAnalysis() {
  const location = useLocation();
  const [index, setIndex] = useState(location.state?.index || null);
  const [playerName, setPlayerName] = useState(location.state?.playerName || localStorage.getItem('playerName'));
  const [tag, setTag] = useState(location.state?.tag || localStorage.getItem('tag'));
  const [analysis, setAnalysis] = useState('');
  const [goodPlayerStats, setGoodPlayerStats] = useState(null);
  const [badPlayerStats, setBadPlayerStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (index === null) {
      const storedIndex = localStorage.getItem('matchIndex');
      if (storedIndex) {
        setIndex(parseInt(storedIndex, 10));
      }
    }
  }, [index]);

  useEffect(() => {
    if (index !== null) {
      localStorage.setItem('matchIndex', index);
      const fetchAnalysis = async () => {
        try {
          const response = await fetch('http://localhost:8000/analyze_match/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              game_name: playerName,
              tag_line: tag,
              match_index: index,
            }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setAnalysis(data.openai_response);
          setGoodPlayerStats(data.good_player);
          setBadPlayerStats(data.bad_player);
        } catch (error) {
          setError(error.toString());
        }
      };

      fetchAnalysis();
    }
  }, [index, playerName, tag]);

  const createChartData = () => ({
    labels: ['Kills', 'Deaths', 'Assists', 'Damage', 'Gold Earned', 'Vision Score', 'Minions Killed'],
    datasets: [
      {
        label: goodPlayerStats.summoner_name,
        data: [
          goodPlayerStats.kills,
          goodPlayerStats.deaths,
          goodPlayerStats.assists,
          goodPlayerStats.total_damage_dealt_to_champions,
          goodPlayerStats.gold_earned,
          goodPlayerStats.vision_score,
          goodPlayerStats.total_minions_killed,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: badPlayerStats.summoner_name,
        data: [
          badPlayerStats.kills,
          badPlayerStats.deaths,
          badPlayerStats.assists,
          badPlayerStats.total_damage_dealt_to_champions,
          badPlayerStats.gold_earned,
          badPlayerStats.vision_score,
          badPlayerStats.total_minions_killed,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  });

  return (
    <div className="container">
      <div className="match-analysis">
        <h2>Match Analysis</h2>
        {error && <p className="error">Error: {error}</p>}
        <p>{analysis}</p>
        {goodPlayerStats && badPlayerStats && (
          <div className="stats-container">
            <div className="stats-table">
              <h3>Player Stats</h3>
              <table>
                <thead>
                  <tr>
                    <th>Stat</th>
                    <th>{goodPlayerStats.summoner_name}</th>
                    <th>{badPlayerStats.summoner_name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Kills</td>
                    <td>{goodPlayerStats.kills}</td>
                    <td>{badPlayerStats.kills}</td>
                  </tr>
                  <tr>
                    <td>Deaths</td>
                    <td>{goodPlayerStats.deaths}</td>
                    <td>{badPlayerStats.deaths}</td>
                  </tr>
                  <tr>
                    <td>Assists</td>
                    <td>{goodPlayerStats.assists}</td>
                    <td>{badPlayerStats.assists}</td>
                  </tr>
                  <tr>
                    <td>Damage</td>
                    <td>{goodPlayerStats.total_damage_dealt_to_champions}</td>
                    <td>{badPlayerStats.total_damage_dealt_to_champions}</td>
                  </tr>
                  <tr>
                    <td>Gold Earned</td>
                    <td>{goodPlayerStats.gold_earned}</td>
                    <td>{badPlayerStats.gold_earned}</td>
                  </tr>
                  <tr>
                    <td>Vision Score</td>
                    <td>{goodPlayerStats.vision_score}</td>
                    <td>{badPlayerStats.vision_score}</td>
                  </tr>
                  <tr>
                    <td>Minions Killed</td>
                    <td>{goodPlayerStats.total_minions_killed}</td>
                    <td>{badPlayerStats.total_minions_killed}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="chart">
              <h3>Player Performance Comparison</h3>
              <Bar data={createChartData()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchAnalysis;
