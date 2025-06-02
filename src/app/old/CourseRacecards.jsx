// File: src/app/racecards/CourseRacecards.jsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CourseRacecards.module.css";

// ─────────────────────────────────────────────────────────────
// Re‐use the same helper to extract “2:07” (or similar) from a race
//────────────────────────────────────────────────────────────
function getOffTime(race) {
  const candidates = ["off", "race_time", "off_time", "time"];
  for (const key of candidates) {
    if (race[key] && typeof race[key] === "string" && race[key].trim() !== "") {
      return race[key].trim();
    }
  }
  return "";
}

// ─────────────────────────────────────────────────────────────
// Convert an “HH:MM” string → minutes since midnight (PM if ≤ 8)
//────────────────────────────────────────────────────────────
function timeToMinutes(t) {
  if (!t) return Infinity;
  const [hRaw, mRaw] = t.split(":").map((x) => parseInt(x, 10));
  if (isNaN(hRaw) || isNaN(mRaw)) return Infinity;
  let h = hRaw, m = mRaw;
  if (h <= 8) h += 12; // treat ≤ 8 as PM
  return h * 60 + m;
}

export default function CourseRacecards({ courseNames, byCourse }) {
  // ─── State: ALL vs SINGLE mode ───────────────────────────────
  const [viewMode, setViewMode] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState(courseNames[0] || null);
  const [openRaceIdx, setOpenRaceIdx] = useState(null);

  // ─── State: Next 6 Races ─────────────────────────────────────
  const [nextSixRaces, setNextSixRaces] = useState([]);

  // ─── Compute Next 6 on mount (client) ────────────────────────
  useEffect(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Flatten all races across every course
    const allRaces = [];
    for (const course of courseNames) {
      const races = Array.isArray(byCourse[course]) ? byCourse[course] : [];
      for (const race of races) {
        allRaces.push({ course, race });
      }
    }

    // Filter for races whose off‐time (in minutes) ≥ now
    const upcoming = allRaces
      .map(({ course, race }) => {
        const offTime = getOffTime(race);
        return {
          course,
          race,
          minutes: timeToMinutes(offTime),
        };
      })
      .filter((x) => x.minutes >= currentMinutes)
      .sort((a, b) => a.minutes - b.minutes)
      .slice(0, 6); // take first 6

    setNextSixRaces(upcoming);
  }, [courseNames, byCourse]);

  // ─── Toggle a race → switch to SINGLE mode & open its detail ───
  function toggleRace(courseName, idx) {
    if (
      viewMode === "SINGLE" &&
      selectedCourse === courseName &&
      openRaceIdx === idx
    ) {
      setOpenRaceIdx(null);
    } else {
      setSelectedCourse(courseName);
      setViewMode("SINGLE");
      setOpenRaceIdx(idx);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 1) RENDER “Next 6 Races” BOX
  //────────────────────────────────────────────────────────────
  function renderNextSix() {
    return (
      <div className={styles.nextSixContainer}>
        <h2 className={styles.nextSixHeading}>Next 6 Races</h2>

        {nextSixRaces.length === 0 ? (
          <p className={styles.nextSixEmpty}>No upcoming races today.</p>
        ) : (
          nextSixRaces.map(({ course, race }, idx) => {
            const offTime = getOffTime(race) || "—";
            const raceName = race.race_name || "";
            // Find the index of this race within its course’s array
            const courseRaces = Array.isArray(byCourse[course])
              ? byCourse[course]
              : [];
            const idxInCourse = courseRaces.findIndex(
              (r2) =>
                getOffTime(r2) === offTime &&
                (r2.race_name || "") === raceName
            );

            return (
              <div
                key={idx}
                className={styles.nextSixItem}
                onClick={() => {
                  if (idxInCourse >= 0) {
                    toggleRace(course, idxInCourse);
                  }
                }}
              >
                <span className={styles.nextSixTime}>{offTime}</span>
                <span className={styles.nextSixCourse}>{course}</span>
                <span className={styles.nextSixName}>{raceName}</span>
              </div>
            );
          })
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2) RENDER “All Courses” VIEW
  //────────────────────────────────────────────────────────────
  function renderAllCoursesView() {
    return (
      <div>
        {/* Next 6 Races box */}
        {renderNextSix()}

        {/* Each course in a card, showing off‐time buttons */}
        {courseNames.map((courseName, ci) => {
          const races = Array.isArray(byCourse[courseName])
            ? byCourse[courseName]
            : [];

          return (
            <div key={ci} className={styles.courseRowBox}>
              <div className={styles.courseRow}>
                {/* Course name (click to go to SINGLE) */}
                <div
                  className={styles.courseNameCell}
                  onClick={() => {
                    setSelectedCourse(courseName);
                    setViewMode("SINGLE");
                    setOpenRaceIdx(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {courseName}{" "}
                  <span className={styles.courseCount}>
                    ({races.length})
                  </span>
                </div>

                {/* Off‐time buttons */}
                <div className={styles.timesCell}>
                  {races.length === 0 ? (
                    <span className={styles.noRacesText}>
                      No races found
                    </span>
                  ) : (
                    races.map((race, idx) => {
                      const offTime = getOffTime(race) || "—";
                      const isOpen =
                        viewMode === "SINGLE" &&
                        selectedCourse === courseName &&
                        openRaceIdx === idx;
                      return (
                        <button
                          key={idx}
                          className={`
                            ${styles.timeButton}
                            ${isOpen ? styles.timeButtonActive : ""}
                          `}
                          onClick={() => toggleRace(courseName, idx)}
                          title={`View racecard for ${race.race_name}`}
                        >
                          {offTime}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3) RENDER “Single Course” VIEW
  //────────────────────────────────────────────────────────────
  function renderSingleCourseView() {
    const races = Array.isArray(byCourse[selectedCourse])
      ? byCourse[selectedCourse]
      : [];

    return (
      <div>
        {/* Back to all courses */}
        <div className={styles.backButtonContainer}>
          <button
            className={styles.backButton}
            onClick={() => {
              setViewMode("ALL");
              setOpenRaceIdx(null);
            }}
          >
            ← Back to All Courses
          </button>
        </div>

        {/* Horizontal row of course “chips” */}
        <div className={styles.courseLinkList}>
          {courseNames.map((courseName) => (
            <button
              key={courseName}
              className={`
                ${styles.courseLink}
                ${courseName === selectedCourse ? styles.courseLinkActive : ""}
              `}
              onClick={() => {
                setSelectedCourse(courseName);
                setOpenRaceIdx(null);
              }}
            >
              {courseName} ({byCourse[courseName]?.length ?? 0})
            </button>
          ))}
        </div>

        {/* The selected course’s card of off‐time buttons */}
        <div className={styles.courseRowBox}>
          <div className={styles.courseRow}>
            <div className={styles.courseNameCell}>
              {selectedCourse}{" "}
              <span className={styles.courseCount}>
                ({races.length})
              </span>
            </div>
            <div className={styles.timesCell}>
              {races.length === 0 ? (
                <span className={styles.noRacesText}>
                  No races found
                </span>
              ) : (
                races.map((race, idx) => {
                  const offTime = getOffTime(race) || "—";
                  const isOpen = openRaceIdx === idx;
                  return (
                    <button
                      key={idx}
                      className={`
                        ${styles.timeButton}
                        ${isOpen ? styles.timeButtonActive : ""}
                      `}
                      onClick={() => toggleRace(selectedCourse, idx)}
                      title={`View racecard for ${race.race_name}`}
                    >
                      {offTime}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Detail panel for the open race */}
        {openRaceIdx !== null && (
          <div className={styles.raceDetailPanel}>
            {(() => {
              const race = races[openRaceIdx];
              if (!race) return null;

              // 1) Basic Race Info
              const offTime = getOffTime(race) || "—";
              const raceName = race.race_name || "";
              const distance = race.distance || race.dist || "—";
              const going = race.going || "—";

              // 2) Runners (if present)
              const runners = Array.isArray(race.runners)
                ? race.runners
                : [];

              return (
                <div>
                  {/* BASIC INFO ROW */}
                  <div className={styles.basicInfoRow}>
                    <span className={styles.detailLabel}>Off Time:</span>
                    <span className={styles.detailValue}>{offTime}</span>

                    <span className={styles.detailLabel}>Distance:</span>
                    <span className={styles.detailValue}>{distance}</span>

                    <span className={styles.detailLabel}>Going:</span>
                    <span className={styles.detailValue}>{going}</span>
                  </div>

                  {/* FULL RACE NAME */}
                  <div className={styles.raceNameRow}>
                    <span className={styles.detailLabel}>Race Name:</span>
                    <span className={styles.detailValue}>{raceName}</span>
                  </div>

                  {/* RUNNERS TABLE (scrollable on mobile) */}
                  <div className={styles.tableContainer}>
                    {runners.length > 0 ? (
                      <div className={styles.runnersSection}>
                        {/* HEADER ROW */}
                        <div className={styles.runnerHeaderRow}>
                          <div>Silk</div>
                          <div>No.</div>
                          <div>Horse</div>
                          <div>Jockey</div>
                          <div>Trainer</div>
                          <div style={{ textAlign: "right" }}>Weight</div>
                        </div>

                        {/* EACH RUNNER */}
                        {runners.map((runner, ridx) => {
                          const silkUrl = runner.silk_url || "";
                          const number = runner.number || "";
                          const horseName =
                            runner.horse_name || runner.horse || "";
                          const jockey = runner.jockey || "";
                          const trainer = runner.trainer || "";
                          const weight = runner.weight || "";

                          return (
                            <div key={ridx} className={styles.runnerRow}>
                              <div className={styles.silkCell}>
                                {silkUrl ? (
                                  <Image
                                    src={silkUrl}
                                    alt="silk"
                                    fill
                                    sizes="40px"
                                    style={{ objectFit: "contain" }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                  />
                                )}
                              </div>
                              <div className={styles.numberCell}>
                                {number}
                              </div>
                              <div className={styles.horseCell}>
                                {horseName}
                              </div>
                              <div className={styles.jockeyCell}>
                                {jockey}
                              </div>
                              <div className={styles.trainerCell}>
                                {trainer}
                              </div>
                              <div
                                className={styles.weightCell}
                                style={{ textAlign: "right" }}
                              >
                                {weight}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>No runner information available.</p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  return viewMode === "ALL"
    ? renderAllCoursesView()
    : renderSingleCourseView();
}
