"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Predictions.module.css";

/**
 * PredictionsAccordion
 *
 * Renders a list of “courses.”  When you click an off-time,
 * it expands that course’s “race details” (race name, distance, going, etc.)
 * and shows a “View Racecard” link that jumps to the correct race in the Racecards page.
 *
 * Only one course can be open at a time.
 */
export default function PredictionsAccordion({ races }) {
  // openIndex === index of the course that’s currently expanded,
  // or null if none is expanded
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ marginTop: "1rem" }}>
      {races.map((race, idx) => {
        const offTime = race.race_time || "—";
        const courseName = race.course || "—";
        const raceName = race.race_name || `Race ${idx + 1}`;
        const distance = race.distance || "—";
        const going = race.going || "—";

        // Build an ID that exactly matches what racecards page will use
        // (so linking by #anchor will scroll there).
        const anchorText = `${courseName}-${offTime.replace(/:/g, "-")}-${idx}`;
        const anchorId = encodeURIComponent(anchorText);

        const isOpen = openIndex === idx;

        // Any other race‐level fields you want to show:
        const extraFields = { ...race };
        delete extraFields.course;
        delete extraFields.race_time;
        delete extraFields.race_name;
        delete extraFields.distance;
        delete extraFields.going;

        return (
          <details
            key={idx}
            className={styles.courseSection}
            onToggle={(e) => {
              // This ensures only one <details> is open at a time.
              // If the user manually closes by clicking the triangle, we sync state; 
              // if they open a new one, we close the old.
              if (e.target.open) {
                setOpenIndex(idx);
              } else {
                // If they clicked to close the same one, clear it
                if (openIndex === idx) {
                  setOpenIndex(null);
                }
              }
            }}
            open={isOpen}
          >
            <summary className={styles.courseHeader}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span className={styles.arrow} />
                {`${courseName} — ${offTime}`}
              </span>
            </summary>

            {isOpen && (
              <div className={styles.courseBody}>
                {/* Race name */}
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Race Name:</span>
                  <span>{raceName}</span>
                </div>

                {/* Distance */}
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Distance:</span>
                  <span>{distance}</span>
                </div>

                {/* Going */}
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Going:</span>
                  <span>{going}</span>
                </div>

                {/* Any other race‐level fields */}
                {Object.entries(extraFields).map(([key, val]) => {
                  let displayVal;
                  if (typeof val === "object" && val !== null) {
                    displayVal = JSON.stringify(val, null, 2);
                  } else {
                    displayVal = String(val);
                  }
                  return (
                    <div className={styles.detailRow} key={key}>
                      <span className={styles.detailLabel}>
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span>{displayVal}</span>
                    </div>
                  );
                })}

                {/* “View Racecard” link that jumps to /racecards#<anchorId> */}
                <Link
                  href={`/racecards#${anchorId}`}
                  className={styles.viewRacecardLink}
                >
                  View Racecard
                </Link>
              </div>
            )}
          </details>
        );
      })}
    </div>
  );
}
