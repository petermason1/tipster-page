// File: src/components/RacecardViewer.jsx
"use client";

import React from "react";

/**
 * Given a race object, return an array of JSX lines for every key (except "runners").
 * We’ll only call this for the “visibleRaceKeys” that the user has checked.
 */
function renderRaceDetails(raceObj, visibleRaceKeys) {
  return visibleRaceKeys.map((key) => {
    // If raceObj does not actually have this key, just skip
    if (!Object.prototype.hasOwnProperty.call(raceObj, key)) {
      return null;
    }

    let value = raceObj[key];
    let displayValue;
    if (value === null || value === undefined) {
      displayValue = "—";
    } else if (typeof value === "object") {
      displayValue = JSON.stringify(value, null, 2);
    } else {
      displayValue = String(value);
    }

    const prettyKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
      <div key={key} style={{ marginBottom: "0.25rem" }}>
        <strong>{prettyKey}:</strong>{" "}
        <span style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          {displayValue}
        </span>
      </div>
    );
  });
}

/**
 * RacecardViewer
 *
 * Props: 
 *   - racecardsByCourse: { [courseName]: RaceObject[] }
 *   - visibleRaceKeys: string[]    // only render these race‐level fields
 *   - visibleRunnerKeys: string[]  // only render these runner‐level fields
 */
export default function RacecardViewer({
  racecardsByCourse,
  visibleRaceKeys,
  visibleRunnerKeys,
}) {
  // Sort courses alphabetically:
  const courseNames = Object.keys(racecardsByCourse).sort();

  return (
    <div>
      {courseNames.map((courseName) => {
        const races = racecardsByCourse[courseName];

        return (
          <section key={courseName} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              {courseName} (<em>{races.length} race{races.length !== 1 ? "s" : ""}</em>)
            </h2>

            {races.map((race, idx) => {
              return (
                <article
                  key={race.race_id || `${courseName}-${idx}`}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    backgroundColor: "#fafafa",
                  }}
                >
                  {/* ─── A) Race‐level fields ─────────────────────────── */}
                  <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ margin: "0 0 0.5rem 0" }}>
                      {race.race_name || `Race ${idx + 1}`}{" "}
                      <span style={{ fontSize: "0.9rem", color: "#555" }}>
                        (Off Time: {race.off_time || "—"})
                      </span>
                    </h3>

                    {renderRaceDetails(race, visibleRaceKeys)}
                  </div>

                  {/* ─── B) Runners table ───────────────────────────────── */}
                  {Array.isArray(race.runners) && race.runners.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <thead>
                          <tr>
                            {visibleRunnerKeys.map((colKey) => (
                              <th
                                key={colKey}
                                style={{
                                  borderBottom: "1px solid #bbb",
                                  textAlign: "left",
                                  padding: "6px 4px",
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#f0f0f0",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {colKey
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {race.runners.map((runner, ridx) => (
                            <tr key={ridx}>
                              {visibleRunnerKeys.map((colKey) => {
                                let cellValue = runner[colKey];
                                if (cellValue === null || cellValue === undefined) {
                                  cellValue = "—";
                                } else if (typeof cellValue === "object") {
                                  cellValue = JSON.stringify(cellValue);
                                } else {
                                  cellValue = String(cellValue);
                                }

                                return (
                                  <td
                                    key={colKey}
                                    style={{
                                      borderBottom: "1px solid #eee",
                                      padding: "4px",
                                      verticalAlign: "top",
                                      fontSize: "0.88rem",
                                      fontFamily: "monospace",
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {cellValue}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ fontStyle: "italic", color: "#666" }}>
                      (No runners listed for this race.)
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
