'use client';
import React, { useEffect, useState } from 'react';
import styles from './Racecards.module.css';

export default function RacecardsPage() {
  const [racecards, setRacecards] = useState([]);

  useEffect(() => {
    const fetchRacecards = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
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

  const escapeApostrophes = (text) => {
    return text.replace(/'/g, '&#39;');
  };

  return (
    <main className={styles.racecardsPage}>
      <h1>Today's Racecards</h1>
      {racecards.map((race) => (
        <div key={race.race_id} className={styles.raceCard}>
          <div className={styles.raceHeader}>
            <strong>{race.off_time} – {race.course}</strong>
            <span dangerouslySetInnerHTML={{ __html: escapeApostrophes(race.race_name) }} />
            <small>{race.race_class} | {race.type} | {race.distance_round}</small>
          </div>
          <table className={styles.runnerTable}>
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
  );
}
