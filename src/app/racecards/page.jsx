// File: src/app/racecards/page.jsx

import fs from "fs";
import path from "path";
import CourseRacecards from "./CourseRacecards";

// ───────────────────────────────────────────────────────────────
// Helper: Format a “YYYY-MM-DD” string → “2nd June 2025”
//──────────────────────────────────────────────────────────────
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
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const monthName = monthNames[d.getMonth()];
  const yearNum = d.getFullYear();

  return `${dayNum}${ordinal} ${monthName} ${yearNum}`;
}

// ───────────────────────────────────────────────────────────────
// Helper: From a race object, pick its off‐time string (if any)
//──────────────────────────────────────────────────────────────
function getOffTime(race) {
  // Try common fields until we find a non‐empty string
  const candidates = ["off", "race_time", "off_time", "time"];
  for (const key of candidates) {
    if (race[key] && typeof race[key] === "string" && race[key].trim() !== "") {
      return race[key].trim();
    }
  }
  return "";
}

// ───────────────────────────────────────────────────────────────
// Helper: Convert “2:07” → minutes since midnight (treat ≤ 8 as PM)
//──────────────────────────────────────────────────────────────
function parseOffToMinutes(t) {
  if (!t || typeof t !== "string") return Infinity;
  const parts = t.split(":").map((x) => parseInt(x, 10));
  if (parts.length !== 2) return Infinity;
  let [h, m] = parts;
  if (isNaN(h) || isNaN(m)) return Infinity;
  // If hour ≤ 8, assume PM → add 12
  if (h <= 8) h += 12;
  return h * 60 + m;
}

export default function RacecardsPage() {
  // ─────────────────────────────────────────────────────────────
  // 1) Read all “*-racecards.json” files under /public/data
  //────────────────────────────────────────────────────────────
  const dataDir = path.join(process.cwd(), "public", "data");
  let files = [];
  try {
    files = fs
      .readdirSync(dataDir)
      .filter((f) => f.endsWith("-racecards.json"));
  } catch (e) {
    console.warn("Could not read /public/data:", e.message);
    files = [];
  }
  files.sort();

  // ─────────────────────────────────────────────────────────────
  // 2) If no files, show fallback message
  //────────────────────────────────────────────────────────────
  if (files.length === 0) {
    return (
      <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Racecards</h1>
        <p>No racecard JSON files found in <code>/public/data</code>.</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3) Parse the latest racecards file
  //────────────────────────────────────────────────────────────
  const latestFile = files[files.length - 1];
  let parsed = { date: null, races: [] };
  try {
    const raw = fs.readFileSync(path.join(dataDir, latestFile), "utf-8");
    const data = JSON.parse(raw);

    if (Array.isArray(data.races)) {
      parsed = { date: data.date || null, races: data.races };
    } else if (Array.isArray(data.racecards)) {
      parsed = { date: data.date || null, races: data.racecards };
    } else {
      parsed = { date: data.date || null, races: data.races || [] };
    }
  } catch (err) {
    console.warn("Error parsing JSON:", err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // 4) Determine heading date (from parsed.date or filename)
  //────────────────────────────────────────────────────────────
  const rawDate =
    parsed.date ||
    latestFile.replace("-racecards.json", "");
  const formattedDate = formatDateWithOrdinal(rawDate);

  // ─────────────────────────────────────────────────────────────
  // 5) Group races by course and sort each group by off‐time
  //────────────────────────────────────────────────────────────
  const byCourse = {};
  for (const race of parsed.races) {
    const courseName = race.course || "Unknown Course";
    if (!byCourse[courseName]) byCourse[courseName] = [];
    byCourse[courseName].push(race);
  }

  Object.keys(byCourse).forEach((courseName) => {
    byCourse[courseName].sort((a, b) => {
      const aOff = getOffTime(a);
      const bOff = getOffTime(b);
      return parseOffToMinutes(aOff) - parseOffToMinutes(bOff);
    });
  });

  const courseNames = Object.keys(byCourse).sort((a, b) =>
    a.localeCompare(b)
  );

  // ─────────────────────────────────────────────────────────────
  // 6) Render the heading + CourseRacecards component
  //────────────────────────────────────────────────────────────
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
        Racecards — {formattedDate}
      </h1>
      <CourseRacecards
        courseNames={courseNames}
        byCourse={byCourse}
      />
    </div>
  );
}
