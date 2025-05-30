'use client';
import React, { useEffect, useState } from 'react';

export default function RacecardsPage() {
  const [racecards, setRacecards] = useState([]);

  useEffect(() => {
    const fetchRacecards = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
        const response = await fetch(`/data/${today}-racecards.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data.racecards)) {
          const sorted = [...data.racecards].sort((a, b) => {
            if (a.course < b.course) return -1;
            if (a.course > b.course) return 1;
            return a.off_time.localeCompare(b.off_time);
          });
          setRacecards(sorted);
        } else {
          console.warn('Racecards JSON missing or malformed.');
        }
      } catch (error) {
        console.error('Error fetching racecards:', error);
      }
    };
    fetchRacecards();
  }, []);

  const safeText = (text) => {
    if (!text) return '';
    return text.replace(/'/g, '\u2019');
  };

  return (
    <>
      <main className="racecardsPage">
        <h1>Today’s Racecards</h1>
        {racecards.length === 0 && <p>No racecards found for today.</p>}
        {racecards.map((race) => (
          <div key={race.race_id} className="raceCard">
            <div className="raceHeader">
              <strong>{race.off_time} – {race.course}</strong>
              <span>{safeText(race.race_name)}</span>
              <small>{race.race_class} | {race.type} | {race.distance_round}</small>
            </div>
            <table className="runnerTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Draw</th>
                  <th>Horse</th>
                  <th>Jockey</th>
                  <th>Trainer</th>
                  <th>OFR</th>
                  <th>Form</th>
                </tr>
              </thead>
              <tbody>
                {race.runners.map((runner) => (
                  <tr key={runner.horse_id}>
                    <td>{runner.number}</td>
                    <td>{runner.draw}</td>
                    <td>{runner.horse}</td>
                    <td>{runner.jockey}</td>
                    <td>{runner.trainer}</td>
                    <td>{runner.ofr}</td>
                    <td>{runner.form}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>

      <style jsx>{`
        .racecardsPage {
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f9f9f9;
          color: #222;
        }
        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .raceCard {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #ddd;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .raceHeader {
          margin-bottom: 1rem;
          padding: 0 1rem;
        }
        .raceHeader strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 0.3rem;
          color: #0070f3;
        }
        .raceHeader span {
          font-weight: 600;
          font-size: 1.05rem;
          display: block;
          margin-bottom: 0.3rem;
          color: #111;
        }
        .raceHeader small {
          color: #666;
          font-size: 0.85rem;
          font-style: italic;
        }
        .runnerTable {
          width: 100%;
          border-collapse: collapse;
          margin: 0 1rem 1rem 1rem;
        }
        .runnerTable th,
        .runnerTable td {
          border: 1px solid #eee;
          padding: 0.5rem 0.8rem;
          text-align: left;
          font-size: 0.9rem;
        }
        .runnerTable th {
          background-color: #f0f0f0;
          font-weight: 600;
          color: #333;
        }
        .runnerTable tbody tr:hover {
          background-color: #fafafa;
        }
      `}</style>
    </>
  );
}
