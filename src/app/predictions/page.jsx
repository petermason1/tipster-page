// File: src/app/predictions/page.jsx

import fs from "fs";
import path from "path";
import CoursePredictions from "./CoursePredictions";

// ─── Format “YYYY-MM-DD” → “2nd June 2025” ───────────────────────────────
function formatDateWithOrdinal(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map((x) => parseInt(x, 10));
  const d = new Date(year, month - 1, day);
  const dayNum = d.getDate();

  const j = dayNum % 10,
    k = dayNum % 100;
  let ordinal = "th";
  if (j === 1 && k !== 11) ordinal = "st";
  else if (j === 2 && k !== 12) ordinal = "nd";
  else if (j === 3 && k !== 13) ordinal = "rd";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[d.getMonth()];
  const yearNum = d.getFullYear();

  return `${dayNum}${ordinal} ${monthName} ${yearNum}`;
}

export default function PredictionsPage() {
  // 1) Read all prediction JSON files from public/data
  const dataDir = path.join(process.cwd(), "public", "data");
  let files = [];
  try {
    files = fs
      .readdirSync(dataDir)
      .filter((f) => f.startsWith("predictions_") && f.endsWith(".json"));
  } catch (e) {
    console.warn("Could not read /public/data:", e.message);
    files = [];
  }
  files.sort();

  // 2) If no files, show a “no data” message
  if (files.length === 0) {
    return (
      <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Today’s Predictions</h1>
        <p>No prediction JSON files found in <code>/public/data</code>.</p>
      </div>
    );
  }

  // 3) Parse the latest file
  const latestFile = files[files.length - 1];
  let parsed = { date: null, races: [] };
  try {
    const raw = fs.readFileSync(path.join(dataDir, latestFile), "utf-8");
    parsed = JSON.parse(raw);
  } catch (err) {
    console.warn("Error parsing JSON:", err.message);
  }

  // 4) Format the date for the heading
  const rawDate =
    parsed.date ||
    latestFile.replace("predictions_", "").replace(".json", "");
  const formattedDate = formatDateWithOrdinal(rawDate);

  // 5) Extract races array (fallback to empty)
  const races = Array.isArray(parsed.races) ? parsed.races : [];

  // 6) Group races by course, then sort each by off_time
  function parseTimeToMinutes(t) {
    // Now treats “1:40” as 13:40 (1:40 PM), etc.
    if (!t || typeof t !== "string") return Infinity;
    let [hh, mm] = t.split(":").map((x) => parseInt(x, 10));
    if (isNaN(hh) || isNaN(mm)) return Infinity;
    // Assume any hour <= 8 is actually PM (add 12). This covers typical flat‐racing times:
    if (hh <= 8) {
      hh += 12;
    }
    return hh * 60 + mm;
  }

  const byCourse = {};
  for (const race of races) {
    const course = race.course || "Unknown Course";
    if (!byCourse[course]) byCourse[course] = [];
    byCourse[course].push(race);
  }
  Object.keys(byCourse).forEach((courseName) => {
    byCourse[courseName].sort(
      (a, b) => parseTimeToMinutes(a.race_time) - parseTimeToMinutes(b.race_time)
    );
  });

  const courseNames = Object.keys(byCourse).sort((a, b) =>
    a.localeCompare(b)
  );

  // 7) Render the heading + client component
  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h1
        style={{
          fontSize: "1.5rem",
          marginBottom: "1rem",
          fontWeight: 600,
          color: "#333",
        }}
      >
        Today’s Predictions — {formattedDate}
      </h1>
      <CoursePredictions courseNames={courseNames} byCourse={byCourse} />
    </div>
  );
}
