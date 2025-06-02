// src/app/racecards/page.jsx
"use client";

import { useEffect, useState } from "react";
import RaceCardList from "./components/RaceCardList";
import styles from "./RaceCard.module.css";

export default function RaceCardPage() {
  const [raceData, setRaceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/data/racecards/2025-06-02-racecards.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setRaceData(Array.isArray(json.racecards) ? json.racecards : []);
      })
      .catch((e) => {
        console.error(e);
        setErr(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sort by off_dt chronologically
  const sorted = [...raceData].sort((a, b) => {
    const aT = a.off_dt ? new Date(a.off_dt).getTime() : 0;
    const bT = b.off_dt ? new Date(b.off_dt).getTime() : 0;
    return aT - bT;
  });

  if (loading) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <p style={{ color: "#6B7280" }}>Loading race data…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <p style={{ color: "#DC2626" }}>Error: {err}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container" style={{ padding: "2rem 0" }}>
        <h1 className={styles.title}>Racecard (2025-06-02)</h1>
        <RaceCardList races={sorted} />
      </div>
    </div>
  );
}
