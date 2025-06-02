// File: src/app/results/CourseResults.jsx

"use client";

import { useState } from "react";
import styles from "./CourseResults.module.css";

/**
 * Props:
 *   - courseNames: string[]
 *   - byCourse: Record<string, Array<{
 *       race_id: string,
 *       date: string,
 *       course: string,
 *       off: string,         // e.g. "2:07"
 *       off_dt: string,      // ISO string
 *       race_name: string,
 *       dist: string,
 *       going: string,
 *       runners: Array<{ … }>
 *       // plus many other fields we’ll ignore
 *     }>>
 */
export default function CourseResults({ courseNames, byCourse }) {
  const [viewMode, setViewMode] = useState("ALL");
  const [selectedCourse, setSelectedCourse] = useState(courseNames[0] || null);
  const [openRaceIdx, setOpenRaceIdx] = useState(null);

  // Toggle a given race in “Single Course” mode
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

  // ───────────────────────────────────────────────────────────────────────
  // 1) RENDER “All Courses” View
  //────────────────────────────────────────────────────────────────────────
  function renderAllCoursesView() {
    return (
      <div>
        {courseNames.map((courseName, ci) => {
          const races = Array.isArray(byCourse[courseName])
            ? byCourse[courseName]
            : [];

          return (
            <div key={ci} className={styles.courseRowBox}>
              <div className={styles.courseRow}>
                {/* Course Name (clickable to drill into SINGLE) */}
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

                {/* Off‐time Buttons */}
                <div className={styles.timesCell}>
                  {races.length === 0 ? (
                    <span className={styles.noRacesText}>
                      No races found
                    </span>
                  ) : (
                    races.map((race, idx) => {
                      const offTime = race.off || "—";
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
                          title={`View results for ${race.race_name}`}
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

  // ───────────────────────────────────────────────────────────────────────
  // 2) RENDER “Single Course” View
  //────────────────────────────────────────────────────────────────────────
  function renderSingleCourseView() {
    const races = Array.isArray(byCourse[selectedCourse])
      ? byCourse[selectedCourse]
      : [];

    return (
      <div>
        {/* Back to All Courses */}
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

        {/* Course Links Row */}
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

        {/* Selected Course Card */}
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
                  const offTime = race.off || "—";
                  const isOpen = openRaceIdx === idx;
                  return (
                    <button
                      key={idx}
                      className={`
                        ${styles.timeButton}
                        ${isOpen ? styles.timeButtonActive : ""}
                      `}
                      onClick={() => toggleRace(selectedCourse, idx)}
                      title={`View results for ${race.race_name}`}
                    >
                      {offTime}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Detail Panel for the OPEN Race */}
        {openRaceIdx !== null && (
          <div className={styles.raceDetailPanel}>
            {(() => {
              const race = races[openRaceIdx];
              if (!race) return null;

              const offTime = race.off || "—";
              const raceName = race.race_name || "";
              const distance = race.dist || "";
              const going = race.going || "";
              const runners = Array.isArray(race.runners) ? race.runners : [];

              return (
                <div>
                  {/* 1) BASIC RACE INFO */}
                  <div className={styles.basicInfoRow}>
                    <span className={styles.detailLabel}>Off Time:</span>
                    <span className={styles.detailValue}>{offTime}</span>

                    <span className={styles.detailLabel}>Distance:</span>
                    <span className={styles.detailValue}>{distance}</span>

                    <span className={styles.detailLabel}>Going:</span>
                    <span className={styles.detailValue}>{going}</span>
                  </div>

                  {/* 2) RACE NAME */}
                  <div className={styles.raceNameRow}>
                    <span className={styles.detailLabel}>Race Name:</span>
                    <span className={styles.detailValue}>{raceName}</span>
                  </div>

                  {/* 3) RUNNERS TABLE */}
                  {runners.length > 0 ? (
                    <div className={styles.runnersSection}>
                      <div className={styles.runnerHeaderRow}>
                        <div>Pos</div>
                        <div>Silk</div>
                        <div>Number</div>
                        <div>Horse</div>
                        <div>Jockey</div>
                        <div style={{ textAlign: "right" }}>Time</div>
                      </div>
                      {runners.map((runner, ridx) => {
                        const pos = runner.position || "";
                        const silkUrl = runner.silk_url || "";
                        const number = runner.number || "";
                        const horse = runner.horse || "";
                        const jockey = runner.jockey || "";
                        const time = runner.time || "";

                        return (
                          <div key={ridx} className={styles.runnerRow}>
                            <div>{pos}</div>
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
                                <div style={{ width: "40px", height: "40px" }} />
                              )}
                            </div>
                            <div className={styles.numberCell}>
                              {number}
                            </div>
                            <div className={styles.horseCell}>
                              {horse}
                            </div>
                            <div className={styles.jockeyCell}>
                              {jockey}
                            </div>
                            <div
                              className={styles.scoreCell}
                              style={{ textAlign: "right" }}
                            >
                              {time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No runner information available.</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────
  return viewMode === "ALL"
    ? renderAllCoursesView()
    : renderSingleCourseView();
}
