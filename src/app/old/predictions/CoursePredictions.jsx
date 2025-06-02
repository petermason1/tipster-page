// File: src/app/predictions/CoursePredictions.jsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CoursePredictions.module.css";

export default function CoursePredictions({ courseNames = [], byCourse = {} }) {
  // ─── View Mode State (“ALL” vs “SINGLE”) ───────────────────────
  const [viewMode, setViewMode] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState(courseNames[0] || null);
  const [openRaceIdx, setOpenRaceIdx] = useState(null);

  // ─── Next 6 Races Data (client‐only) ───────────────────────────
  const [nextSixRaces, setNextSixRaces] = useState([]);

  // ─── Convert “HH:MM” to minutes since midnight (1:40 → 13:40) ───
  function timeToMinutes(t) {
    if (!t) return Infinity;
    let [h, m] = t.split(":").map((x) => parseInt(x, 10));
    if (isNaN(h) || isNaN(m)) return Infinity;
    // Treat hours ≤ 8 as PM (add 12)
    if (h <= 8) h += 12;
    return h * 60 + m;
  }

  // ─── On mount (and whenever courseNames or byCourse changes), compute the next 6 races ──
  useEffect(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Flatten all races into [{ course, race }]
    const allRaces = [];
    for (const course of courseNames) {
      const races = Array.isArray(byCourse[course]) ? byCourse[course] : [];
      for (const race of races) {
        allRaces.push({ course, race });
      }
    }

    // Filter to races whose race_time ≥ now, sort by time, slice 6
    const upcoming = allRaces
      .map(({ course, race }) => ({
        course,
        race,
        minutes: timeToMinutes(race.race_time),
      }))
      .filter((x) => x.minutes >= currentMinutes)
      .sort((a, b) => a.minutes - b.minutes)
      .slice(0, 6);

    setNextSixRaces(upcoming);
  }, [courseNames, byCourse]);

  // ─── Helper: is this race “held”? (held either flagged or result === "held") ──
  function isRaceHeld(race) {
    return (
      (race.result && String(race.result).toLowerCase() === "held") ||
      race.held === true
    );
  }

  // ─── Toggle a race’s detail panel (and switch to SINGLE mode) ────
  function toggleRace(courseName, idx) {
    if (
      viewMode === "SINGLE" &&
      selectedCourse === courseName &&
      openRaceIdx === idx
    ) {
      // Already open → close it
      setOpenRaceIdx(null);
    } else {
      setSelectedCourse(courseName);
      setViewMode("SINGLE");
      setOpenRaceIdx(idx);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 1) RENDER “Next 6 Races” (CLICKABLE BUTTONS, ACCESSIBLE) ────────
  //────────────────────────────────────────────────────────────────
  function renderNextSix() {
    return (
      <section role="region" aria-labelledby="next-6-heading">
        <h2 id="next-6-heading" className={styles.nextSixHeading}>
          Next 6 Races
        </h2>

        <div className={styles.nextSixContainer}>
          {nextSixRaces.length === 0 ? (
            <p className={styles.nextSixEmpty}>No upcoming races today.</p>
          ) : (
            nextSixRaces.map(({ course, race }, idx) => {
              const offTime = race.race_time || "—";
              const raceName = race.race_name || "";

              // Find this race’s index within its course array
              const courseRaces = Array.isArray(byCourse[course])
                ? byCourse[course]
                : [];
              const idxInCourse = courseRaces.findIndex(
                (r2) =>
                  r2.race_time === race.race_time &&
                  (r2.race_name || "") === raceName
              );

              const isOpen =
                viewMode === "SINGLE" &&
                selectedCourse === course &&
                openRaceIdx === idxInCourse;

              return (
                <button
                  key={`${course}-${offTime}-${idx}`}
                  type="button"
                  className={styles.nextSixItem}
                  onClick={() => {
                    if (idxInCourse >= 0) {
                      toggleRace(course, idxInCourse);
                    }
                  }}
                  aria-label={`${offTime} at ${course} — ${raceName || "Race"}`}
                  aria-expanded={isOpen}
                >
                  <span className={styles.nextSixTime}>{offTime}</span>
                  <span className={styles.nextSixCourse}>{course}</span>
                  <span className={styles.nextSixName}>{raceName}</span>
                </button>
              );
            })
          )}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // 2) RENDER “All Courses” VIEW ─────────────────────────────────
  //────────────────────────────────────────────────────────────────
  function renderAllCoursesView() {
    return (
      <div>
        {/* Next 6 Races at top */}
        {renderNextSix()}

        {/* Each course in a “card” */}
        {courseNames.map((courseName, ci) => {
          const races = Array.isArray(byCourse[courseName])
            ? byCourse[courseName]
            : [];

          return (
            <div key={ci} className={styles.courseRowBox}>
              <div className={styles.courseRow}>
                {/* Course name as a button */}
                <button
                  type="button"
                  className={styles.courseNameButton}
                  onClick={() => {
                    setSelectedCourse(courseName);
                    setViewMode("SINGLE");
                    setOpenRaceIdx(null);
                  }}
                  aria-label={`View all races at ${courseName}`}
                >
                  {courseName}{" "}
                  <span className={styles.courseCount}>
                    ({races.length})
                  </span>
                </button>

                {/* Off‐time buttons */}
                <div className={styles.timesCell}>
                  {races.length === 0 ? (
                    <span className={styles.noRacesText}>No races today</span>
                  ) : (
                    races.map((race, idx) => {
                      const offTime = race.race_time || "—";
                      const held = isRaceHeld(race);
                      const isOpen =
                        viewMode === "SINGLE" &&
                        selectedCourse === courseName &&
                        openRaceIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`${styles.timeButton} ${
                            isOpen ? styles.timeButtonActive : ""
                          } ${held ? styles.timeButtonHeld : ""}`}
                          onClick={() => {
                            if (!held) {
                              toggleRace(courseName, idx);
                            }
                          }}
                          title={held ? "Race result held" : undefined}
                          aria-label={`${offTime} ${
                            held ? "(held)" : ""
                          } at ${courseName}. ${
                            isOpen ? "Collapse details." : "View details."
                          }`}
                          aria-expanded={isOpen}
                          disabled={held}
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

  // ─────────────────────────────────────────────────────────────────
  // 3) RENDER “Single Course” VIEW ─────────────────────────────────
  //────────────────────────────────────────────────────────────────
  function renderSingleCourseView() {
    const races = Array.isArray(byCourse[selectedCourse])
      ? byCourse[selectedCourse]
      : [];

    return (
      <div>
        {/* “Back to All Courses” */}
        <div className={styles.backButtonContainer}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => {
              setViewMode("ALL");
              setOpenRaceIdx(null);
            }}
            aria-label="Back to all courses"
          >
            ← Back to All Courses
          </button>
        </div>

        {/* Horizontal list of course‐chips */}
        <div className={styles.courseLinkList} role="tablist">
          {courseNames.map((courseName) => (
            <button
              key={courseName}
              type="button"
              className={`${styles.courseLink} ${
                courseName === selectedCourse ? styles.courseLinkActive : ""
              }`}
              onClick={() => {
                setSelectedCourse(courseName);
                setOpenRaceIdx(null);
              }}
              role="tab"
              aria-selected={courseName === selectedCourse}
              aria-controls={`course-panel-${courseName}`}
              id={`tab-${courseName}`}
            >
              {courseName} ({byCourse[courseName]?.length ?? 0})
            </button>
          ))}
        </div>

        {/* The selected course’s single card */}
        <div
          className={styles.courseRowBox}
          id={`course-panel-${selectedCourse}`}
          role="tabpanel"
          aria-labelledby={`tab-${selectedCourse}`}
        >
          <div className={styles.courseRow}>
            <div className={styles.courseNameCell}>
              <h3>
                {selectedCourse}{" "}
                <span className={styles.courseCount}>
                  ({races.length})
                </span>
              </h3>
            </div>
            <div className={styles.timesCell}>
              {races.length === 0 ? (
                <span className={styles.noRacesText}>No races today</span>
              ) : (
                races.map((race, idx) => {
                  const offTime = race.race_time || "—";
                  const held = isRaceHeld(race);
                  const isOpen = openRaceIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.timeButton} ${
                        isOpen ? styles.timeButtonActive : ""
                      } ${held ? styles.timeButtonHeld : ""}`}
                      onClick={() => {
                        if (!held) {
                          setOpenRaceIdx(isOpen ? null : idx);
                        }
                      }}
                      title={held ? "Race result held" : undefined}
                      aria-label={`${offTime} ${
                        held ? "(held)" : ""
                      } at ${selectedCourse}. ${
                        isOpen ? "Collapse details." : "View details."
                      }`}
                      aria-expanded={isOpen}
                      disabled={held}
                    >
                      {offTime}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Race Detail Panel (for the selected race) */}
        {openRaceIdx !== null && (
          <div className={styles.raceDetailPanel}>
            {(() => {
              const race = races[openRaceIdx];
              const offTime = race.race_time || "—";
              const raceName = race.race_name || `Race ${openRaceIdx + 1}`;
              const distance = race.distance || "—";
              const going = race.going || "—";
              const anchorText = `${selectedCourse}-${offTime.replace(
                /:/g,
                "-"
              )}-${openRaceIdx}`;
              const anchorId = encodeURIComponent(anchorText);

              // Extract the extra fields from the race object
              const extraFields = { ...race };
              delete extraFields.course;
              delete extraFields.off_time;
              delete extraFields.race_time;
              delete extraFields.race_name;
              delete extraFields.distance;
              delete extraFields.going;
              delete extraFields.runners;

              const runners = Array.isArray(race.runners) ? race.runners : [];

              return (
                <div>
                  {/* 1) BASIC INFO ROW */}
                  <div className={styles.basicInfoRow}>
                    <span className={styles.detailLabel}>Off Time:</span>
                    <span className={styles.detailValue}>{offTime}</span>

                    <div className={styles.distanceGoingContainer}>
                      <span className={styles.detailLabel}>Distance:</span>
                      <span className={styles.detailValue}>{distance}</span>

                      <span className={styles.detailLabel}>Going:</span>
                      <span className={styles.detailValue}>{going}</span>
                    </div>
                  </div>

                  {/* 2) FULL RACE NAME */}
                  <div className={styles.raceNameRow}>
                    <span className={styles.detailLabel}>Race Name:</span>
                    <span className={styles.detailValue}>{raceName}</span>
                  </div>

                  {/* 3) EXTRA RACE‐LEVEL FIELDS */}
                  {Object.entries(extraFields).map(([key, value]) => {
                    if (value == null || value === "") return null;
                    const displayVal =
                      typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value);
                    return (
                      <div className={styles.extraFieldRow} key={key}>
                        <span className={styles.detailLabel}>
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                          :
                        </span>
                        <span className={styles.detailValue}>{displayVal}</span>
                      </div>
                    );
                  })}

                  {/* 4) RUNNERS TABLE */}
                  {runners.length > 0 && (
                    <div className={styles.runnersSection}>
                      <div className={styles.runnerHeaderRow}>
                        <div>Silk</div>
                        <div>Number</div>
                        <div>Horse</div>
                        <div>Jockey</div>
                        <div style={{ textAlign: "right" }}>Score</div>
                      </div>
                      {runners.map((runner, ridx) => {
                        const silkUrl = runner.silk_url || "";
                        const number = runner.number || "";
                        const horseName =
                          runner.horse_name || runner.horse || "—";
                        const jockey = runner.jockey || "—";
                        const scoreVal = runner.model_score;
                        const score =
                          typeof scoreVal === "number"
                            ? scoreVal.toFixed(2)
                            : "—";

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
                              {number ? `No.${number}` : "—"}
                            </div>
                            <div className={styles.horseCell}>{horseName}</div>
                            <div className={styles.jockeyCell}>{jockey}</div>
                            <div
                              className={styles.scoreCell}
                              style={{ textAlign: "right" }}
                            >
                              {score}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 5) VIEW RACECARD LINK */}
                  <div style={{ marginTop: "1rem" }}>
                    <Link
                      href={`/racecards#${anchorId}`}
                      className={styles.viewRacecardLink}
                    >
                      View Racecard ↗
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return viewMode === "ALL"
    ? renderAllCoursesView()
    : renderSingleCourseView();
}
