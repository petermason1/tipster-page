// src/app/racecards/[race_id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./detail.module.css";
import RunnerItem from "../components/RunnerItem";

export default function RaceDetailPage() {
  const { race_id } = useParams();
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!race_id) {
      setErr("No race_id provided");
      setLoading(false);
      return;
    }

    fetch("/data/racecards/2025-06-02-racecards.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const arr = Array.isArray(json.racecards) ? json.racecards : [];
        const found = arr.find((r) => r.race_id === race_id);
        if (!found) throw new Error(`Race ${race_id} not found`);
        setRace(found);
      })
      .catch((e) => {
        console.error(e);
        setErr(e.message);
      })
      .finally(() => setLoading(false));
  }, [race_id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "2rem 0" }}>
        <p style={{ color: "#6B7280" }}>Loading race details…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div
        className="container"
        style={{ padding: "2rem 0", textAlign: "center" }}
      >
        <p style={{ color: "#DC2626", marginBottom: "1rem" }}>Error: {err}</p>
        <Link
          href="/racecards"
          style={{ color: "#4F46E5", textDecoration: "underline" }}
        >
          &larr; Back to all races
        </Link>
      </div>
    );
  }

  const {
    race_name,
    course,
    off_time,
    distance_round,
    distance,
    going,
    prize,
    race_class,
    type,
    age_band,
    runners,
  } = race;

  return (
    <div>
      {/* Purple header bar */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>{race_name}</h1>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: "1.5rem 0" }}>
        {/* Race info card */}
        <div className={styles.infoWrapper}>
          <div className="card">
            <div className={styles.infoGrid}>
              <div>
                <p>
                  <span className={styles.fieldLabel}>Course:</span>
                  <span className={styles.fieldValue}>{course}</span>
                </p>
                <p>
                  <span className={styles.fieldLabel}>Off Time:</span>
                  <span className={styles.fieldValue}>{off_time}</span>
                </p>
              </div>

              <div>
                <p>
                  <span className={styles.fieldLabel}>Distance:</span>
                  <span className={styles.fieldValue}>
                    {distance_round} ({distance})
                  </span>
                </p>
                <p>
                  <span className={styles.fieldLabel}>Going:</span>
                  <span className={styles.fieldValue}>{going || "N/A"}</span>
                </p>
              </div>
            </div>

            <div
              className={styles.infoGrid}
              style={{ marginTop: "1rem" }}
            >
              <div>
                <p>
                  <span className={styles.fieldLabel}>Prize:</span>
                  <span className={styles.fieldValue}>{prize || "N/A"}</span>
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  color: "#6B7280",
                }}
              >
                <p>
                  <span className={styles.fieldLabel}>Race Class:</span>
                  <span className={styles.fieldValue}>
                    {race_class || "N/A"}
                  </span>
                </p>
                <p>
                  <span className={styles.fieldLabel}>Type:</span>
                  <span className={styles.fieldValue}>{type || "N/A"}</span>
                </p>
                <p>
                  <span className={styles.fieldLabel}>Age Band:</span>
                  <span className={styles.fieldValue}>
                    {age_band || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Runners section */}
        <div className={styles.runnersWrapper}>
          <h2 className={styles.runnersTitle}>
            Runners ({Array.isArray(runners) ? runners.length : 0})
          </h2>

          {Array.isArray(runners) && runners.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {runners.map((runner) => (
                <RunnerItem key={runner.horse_id} runner={runner} />
              ))}
            </ul>
          ) : (
            <p style={{ color: "#6B7280" }}>No runners available for this race.</p>
          )}
        </div>

        {/* Back link to list */}
        <div className={styles.backLink}>
          <Link href="/racecards">
            &larr; Back to all races
          </Link>
        </div>
      </div>
    </div>
  );
}
