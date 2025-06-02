// File: src/app/predictions/[date]/page.jsx

import CoursePredictions from "../CoursePredictions";
import fs from "fs/promises";
import path from "path";

export async function generateStaticParams() {
  const dataDir = path.join(process.cwd(), "public", "data");
  const files = await fs.readdir(dataDir);

  // Look for files ending in “-racecards.json” to find available dates:
  const dates = files
    .filter((fname) => fname.endsWith("-racecards.json"))
    .map((fname) => fname.replace("-racecards.json", ""));

  return dates.map((date) => ({ date }));
}

export default async function PredictionsByDate({ params }) {
  const { date } = params; // e.g. “2025-06-02”

  // ── 1) Read your “predictions” JSON (which lives in public/data/${date}-results.json)
  //     (If you are truly only storing predictions under “results.json”, otherwise rename accordingly.)
  const predictionsPath = path.join(
    process.cwd(),
    "public",
    "data",
    `${date}-results.json`
  );
  let rawPredictions = {};
  try {
    const data = await fs.readFile(predictionsPath, "utf8");
    rawPredictions = JSON.parse(data);
  } catch (err) {
    console.warn(`No predictions file found for ${date}:`, err.message);
    rawPredictions = {};
  }

  // rawPredictions is assumed to be an object shaped like:
  // {
  //   "Brighton": [
  //     { race_time, race_name, distance, going, runners: [ { number, horse_name, model_score } ] },
  //     … more races …
  //   ],
  //   "Gowran Park": [ … ],
  //   …
  // }

  // ── 2) Read the full “racecards” JSON (detailed horse info):
  const racecardsPath = path.join(
    process.cwd(),
    "public",
    "data",
    `${date}-racecards.json`
  );
  let rawRacecards = { racecards: [] };
  try {
    const data = await fs.readFile(racecardsPath, "utf8");
    rawRacecards = JSON.parse(data);
  } catch (err) {
    console.warn(`No racecards file found for ${date}:`, err.message);
    rawRacecards = { racecards: [] };
  }

  // ── 3) Group racecards by course so we can merge details with predictions
  const racecardsByCourse = {};
  for (const rc of rawRacecards.racecards) {
    const course = rc.course;
    if (!racecardsByCourse[course]) racecardsByCourse[course] = [];
    racecardsByCourse[course].push(rc);
  }

  // ── 4) Merge predictions with full racecard data by matching off_time <-> race_time
  const mergedByCourse = {};

  for (const courseName of Object.keys(rawPredictions)) {
    const preds = rawPredictions[courseName] || [];
    const cards = racecardsByCourse[courseName] || [];

    mergedByCourse[courseName] = preds.map((predRace) => {
      const matchCard = cards.find(
        (card) =>
          card.off_time === predRace.race_time &&
          (card.race_name || "") === (predRace.race_name || "")
      );

      if (matchCard) {
        // Build runner map from racecard.runners
        const runnerMap = {};
        for (const rcRunner of matchCard.runners || []) {
          runnerMap[String(rcRunner.number).toLowerCase()] = rcRunner;
        }

        // Merge each predicted runner with full info
        const mergedRunners = (predRace.runners || []).map((predRunner) => {
          const key      = String(predRunner.number).toLowerCase();
          const fullInfo = runnerMap[key] || {};
          return { ...fullInfo, ...predRunner };
        });

        return {
          ...matchCard,
          distance: predRace.distance || matchCard.distance,
          going:    predRace.going    || matchCard.going,
          runners: mergedRunners,
        };
      } else {
        // If no matching racecard, just pass the prediction as-is
        return {
          ...predRace,
          runners: predRace.runners || [],
        };
      }
    });
  }

  // If there are courses in the racecards that did not appear in rawPredictions,
  // include them here as well (so every course with a card appears in the UI—even if no model_score).
  for (const courseName of Object.keys(racecardsByCourse)) {
    if (!mergedByCourse[courseName]) {
      mergedByCourse[courseName] = racecardsByCourse[courseName].map((cardRace) => ({
        ...cardRace,
        runners: cardRace.runners || [],
      }));
    }
  }

  // Build the array of course names
  const courseNames = Object.keys(mergedByCourse);

  return (
    <div>
      <h1>Today's Predictions — {date}</h1>
      <CoursePredictions
        courseNames={courseNames}
        byCourse={mergedByCourse}
      />
    </div>
  );
}
