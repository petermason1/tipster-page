// File: src/app/results/page.jsx

import fs from "fs";
import path from "path";
import CourseResults from "./CourseResults";

// Helper to format “YYYY-MM-DD” → “2nd June 2025”
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

export default function ResultsPage() {
  // 1) Find all “*-results.json” files in /public/data
  const dataDir = path.join(process.cwd(), "public", "data");
  let files = [];
  try {
    files = fs
      .readdirSync(dataDir)
      .filter((f) => f.endsWith("-results.json"));
  } catch (e) {
    console.warn("Could not read /public/data:", e.message);
    files = [];
  }
  files.sort();

  if (files.length === 0) {
    return (
      <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Race Results</h1>
        <p>No “-results.json” files found in <code>/public/data</code>.</p>
      </div>
    );
  }

  // 2) Parse the latest results file
  const latestFile = files[files.length - 1];
  let parsed = { results: [] };
  try {
    const raw = fs.readFileSync(path.join(dataDir, latestFile), "utf-8");
    parsed = JSON.parse(raw);
  } catch (err) {
    console.warn("Error parsing JSON:", err.message);
  }

  // 3) Extract a display date (from “date” field or filename)
  const rawDate =
    parsed.results?.[0]?.date ||
    latestFile.replace("-results.json", "");
  const formattedDate = formatDateWithOrdinal(rawDate);

  // 4) Group each result by course → an array sorted by off‐time
  function parseOffToMinutes(t) {
    // “2:07” → treat as 14:07, etc.
    if (!t) return Infinity;
    let [h, m] = t.split(":").map((x) => parseInt(x, 10));
    if (h <= 8) h += 12; // assume ≤ 8 is PM
    return h * 60 + m;
  }

  const byCourse = {};
  for (const res of parsed.results || []) {
    // “res.course” might be “Gowran Park (IRE)”; strip any parentheses if desired
    // For simplicity, use full string:
    const course = res.course || "Unknown Course";
    if (!byCourse[course]) byCourse[course] = [];
    byCourse[course].push(res);
  }

  // Sort each course’s races by their “off” time
  Object.keys(byCourse).forEach((course) => {
    byCourse[course].sort((a, b) => {
      return (
        parseOffToMinutes(a.off) -
        parseOffToMinutes(b.off)
      );
    });
  });

  const courseNames = Object.keys(byCourse).sort((a, b) =>
    a.localeCompare(b)
  );

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
        Race Results — {formattedDate}
      </h1>
      <CourseResults
        courseNames={courseNames}
        byCourse={byCourse}
      />
    </div>
  );
}
