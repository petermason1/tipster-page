// src/app/racecards/components/RaceCardItem.jsx
"use client";

import Link from "next/link";

/**
 * Props:
 *   race = {
 *     race_id,
 *     race_name,
 *     course,
 *     off_time,
 *     distance_round,
 *     distance,
 *     going,
 *     prize
 *   }
 */
export default function RaceCardItem({ race }) {
  return (
    <div className="card">
      <h2 className="raceName">{race.race_name}</h2>

      <p>
        <span className="label">Course:</span>
        <span className="value">{race.course}</span>
      </p>

      <p>
        <span className="label">Off Time:</span>{" "}
        <Link href={`/racecards/${race.race_id}`}>
          {race.off_time} &rarr; details
        </Link>
      </p>

      <p>
        <span className="label">Distance:</span>
        <span className="value">
          {race.distance_round} ({race.distance})
        </span>
      </p>

      <p>
        <span className="label">Going:</span>
        <span className="value">{race.going || "N/A"}</span>
      </p>

      <p>
        <span className="label">Prize:</span>
        <span className="value">{race.prize || "N/A"}</span>
      </p>
    </div>
  );
}
