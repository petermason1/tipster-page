// File: src/app/predictions/page.jsx

import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export default async function PredictionsIndex() {
  // 1) Locate the data folder and read all files
  const dataDir = path.join(process.cwd(), "public", "data");
  let files = [];
  try {
    files = await fs.readdir(dataDir);
  } catch (err) {
    console.error("Failed to read data directory:", err);
    files = [];
  }

  // 2) Filter for all “-racecards.json” filenames and extract their dates
  const dates = files
    .filter((file) => file.endsWith("-racecards.json"))
    .map((file) => file.replace("-racecards.json", ""))
    .sort((a, b) => (a < b ? 1 : -1)); // newest dates first

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Predictions by Date</h1>

      {dates.length === 0 ? (
        <p>No prediction data is available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {dates.map((date) => (
            <li key={date} style={{ marginBottom: "0.75rem" }}>
              <Link
                href={`/predictions/${date}`}
                style={{
                  textDecoration: "none",
                  color: "#0050b3",
                  fontSize: "1.1rem",
                }}
              >
                {date}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
