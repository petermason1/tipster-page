'use client';
import React, { useEffect, useState } from 'react';

// Bookie-style place calculation
function getPlacesAllowed(numRunners, raceType = '') {
  const isHandicap = raceType.toLowerCase().includes('handicap');
  if (numRunners >= 16 && isHandicap) return 4;
  if (numRunners >= 8) return 3;
  if (numRunners >= 5) return 2;
  return 1;
}

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`/data/${today}-results.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
          setResults(data.results);
          setLastUpdated(new Date().toLocaleTimeString());
          setError('');
        } else {
          setError('Results data is malformed.');
        }
      } catch (err) {
        setError(`Error fetching results: ${err.message}`);
      }
    };

    fetchResults();

    const interval = setInterval(fetchResults, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Highlight winner (pos=1) and placed (pos <= allowed places)
  const highlightRow = (pos, numRunners, raceType) => {
    const places = getPlacesAllowed(numRunners, raceType);
    if (pos === 1) return { backgroundColor: '#d1ffc8' }; // winner - light green
    if (pos && pos <= places) return { backgroundColor: '#fff4c2' }; // placed - pale yellow
    return {};
  };

  return (
    <>
      <main className="resultsPage">
        <h1>Today’s Results</h1>
        {lastUpdated && (
          <p className="lastUpdated">Last updated: {lastUpdated}</p>
        )}
        {error && <p className="error">{error}</p>}
        {!error && results.length === 0 && <p>No results available.</p>}

        {results.map((race) => (
          <div key={race.race_id} className="raceResult">
            <h3>
              {race.course} – {race.race_name}
            </h3>
            <p className="raceMeta">
              <strong>{race.time}</strong> | {race.class} | {race.dist} | Going: {race.going}
            </p>
            <table className="runnerTable">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Silks</th>
                  <th>Horse</th>
                  <th>SP</th>
                  <th>Jockey</th>
                  <th>Trainer</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {race.runners.map((runner) => {
                  const pos = Number(runner.position);
                  const style = highlightRow(pos, race.runners.length, race.race_name);

                  return (
                    <tr key={runner.horse_id} style={style}>
                      <td>{runner.position || '—'}</td>
                      <td>
                        {runner.silk_url ? (
                          <img
                            src={runner.silk_url}
                            alt={`${runner.horse} silks`}
                            className="silksImg"
                          />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>{runner.horse}</td>
                      <td>{runner.sp || 'N/A'}</td>
                      <td>{runner.jockey}</td>
                      <td>{runner.trainer}</td>
                      <td>{runner.comment || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </main>

      <style jsx>{`
        .resultsPage {
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f9f9f9;
          color: #222;
        }
        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .lastUpdated {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .error {
          color: red;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .raceResult {
          margin-bottom: 3rem;
          padding: 1rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.07);
        }
        .raceResult h3 {
          margin-bottom: 0.5rem;
          color: #0070f3;
        }
        .raceMeta {
          margin-bottom: 1rem;
          font-style: italic;
          color: #555;
        }
        .runnerTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .runnerTable th,
        .runnerTable td {
          border: 1px solid #eee;
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .runnerTable th {
          background-color: #f0f0f0;
          font-weight: 600;
          color: #333;
        }
        .runnerTable tbody tr:hover {
          background-color: #fafafa;
        }
        .silksImg {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
        }
      `}</style>
    </>
  );
}
