import { NextResponse } from 'next/server';
import { readFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';

// Helper to find latest results file
function getLatestResultsFile(dataDir) {
  const files = readdirSync(dataDir)
    .filter(name => name.match(/^\d{4}-\d{2}-\d{2}-results\.json$/)) // e.g. 2025-05-30-results.json
    .sort()
    .reverse();
  return files[0] ? path.join(dataDir, files[0]) : null;
}

export async function GET(req) {
  try {
    const dataDir = '/Users/petermason/horse-tips/data';

    // 1. Get ?date param if present (e.g. ?date=2025-05-29)
    const url = new URL(req.url);
    const queryDate = url.searchParams.get('date');

    let filePath;
    let fileName;

    if (queryDate) {
      fileName = `${queryDate}-results.json`;
      filePath = path.join(dataDir, fileName);
      if (!existsSync(filePath)) {
        return NextResponse.json({ error: `File not found for date: ${queryDate}` }, { status: 404 });
      }
    } else {
      // 2. Try today’s file
      const today = new Date().toISOString().split('T')[0];
      fileName = `${today}-results.json`;
      filePath = path.join(dataDir, fileName);

      if (!existsSync(filePath)) {
        // 3. Fallback to latest available file
        const latest = getLatestResultsFile(dataDir);
        if (!latest) {
          return NextResponse.json({ error: 'No results JSON files found.' }, { status: 404 });
        }
        filePath = latest;
        fileName = path.basename(latest);
      }
    }

    const contents = readFileSync(filePath, 'utf8');
    const results = JSON.parse(contents);

    return NextResponse.json({ file: fileName, results });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
