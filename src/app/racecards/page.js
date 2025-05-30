'use client';
import React, { useEffect, useState } from 'react';

export default function RacecardsPage() {
  const [racecards, setRacecards] = useState([]);

  useEffect(() => {
    const fetchRacecards = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(`/data/${today}-racecards.json`);
        const data = await response.json();
        if (data && Array.isArray(data.racecards)) {
          const sorted = [...data.racecards].sort((a, b) => {
            if (a.course < b.course) return -1;
            if (a.course > b.course) return 1;
            return a.off_time.localeCompare(b.off_time);
          });
          setRacecards(sorted);
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
          font-family: system-ui, sans-serif;
          background: #f9f9f9;
          color: #222;
        }
        h1 {
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .raceCard {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #ccc;
        }
        .raceHeader {
          margin-bottom: 1rem;
        }
        .raceHeader strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }
        .raceHeader span {
          font-weight: 600;
          font-size: 1rem;
          display: block;
          margin-bottom: 0.25rem;
        }
        .raceHeader small {
          color: #666;
          font-size: 0.85rem;
        }
        .runnerTable {
          width: 100%;
          border-collapse: collapse;
        }
        .runnerTable th,
        .runnerTable td {
          border: 1px solid #ddd;
          padding: 0.4rem 0.7rem;
          text-align: left;
          font-size: 0.9rem;
        }
        .runnerTable th {
          background: #eee;
        }
      `}</style>
    </>
  );
}
