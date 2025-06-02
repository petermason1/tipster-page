// src/app/racecards/components/RaceCardList.jsx
"use client";

import RaceCardItem from "./RaceCardItem";

export default function RaceCardList({ races }) {
  if (!Array.isArray(races) || races.length === 0) {
    return <p style={{ color: "#6B7280" }}>No races found for today.</p>;
  }

  return (
    <>
      {races.map((race) => (
        <RaceCardItem key={race.race_id} race={race} />
      ))}
    </>
  );
}
