import { NextResponse } from 'next/server';
import { readFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';

function getLatestRacecardsFile(dataDir) {
  const files = readdirSync(dataDir)
    .filter(name => name.match(/^\d{4}-\d{2}-\d{2}-racecards\.json$/))
    .sort()
    .reverse();
  return files[0] ? path.join(dataDir, files[0]) : null;
}

export async function GET(req) {
  try {
    // Adjust this path to wherever your data folder is relative to the project root
    // Make sure this folder and files are deployed if you want this working on Vercel (which is rare)
    const dataDir = path.resolve('./data');

    // Get ?date param if present
    const url = new URL(req.url);
    const queryDate = url.searchParams.get('date');

    let filePath;
    let fileName;

    if (queryDate) {
      fileName = `${queryDate}-racecards.json`;
      filePath = path.join(dataDir, fileName);
      if (!existsSync(filePath)) {
        return NextResponse.json({ error: `File not found for date: ${queryDate}` }, { status: 404 });
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
      fileName = `${today}-racecards.json`;
      filePath = path.join(dataDir, fileName);
      if (!existsSync(filePath)) {
        const latest = getLatestRacecardsFile(dataDir);
        if (!latest) {
          return NextResponse.json({ error: 'No racecards JSON files found.' }, { status: 404 });
        }
        filePath = latest;
        fileName = path.basename(latest);
      }
    }

    const contents = readFileSync(filePath, 'utf8');
    const racecards = JSON.parse(contents);

    return NextResponse.json({ file: fileName, racecards });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
