import { Router, Request, Response } from "express";
import fetch from "node-fetch";

const router = Router();

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || "EVENTS";

// Helper to parse CSV to array of objects
function csvToJson(csv: string) {
  const [header, ...rows] = csv.trim().split("\n");
  const columns = header.split(",").map(h => h.trim().replace(/(^"|"$)/g, ""));
  return rows.map(row => {
    // Handle quoted fields that may contain commas
    const values: string[] = [];
    let i = 0;
    let current = "";
    let insideQuotes = false;
    for (let c of row) {
      if (c === '"' && !insideQuotes) {
        insideQuotes = true;
        continue;
      }
      if (c === '"' && insideQuotes) {
        insideQuotes = false;
        continue;
      }
      if (c === ',' && !insideQuotes) {
        values.push(current);
        current = "";
        i++;
        continue;
      }
      current += c;
    }
    values.push(current);
    // Clean up quotes
    const cleaned = values.map(v => v.trim().replace(/(^"|"$)/g, ""));
    return columns.reduce((obj, col, i) => {
      obj[col] = cleaned[i] || "";
      return obj;
    }, {} as Record<string, string>);
  });
}

/**
 * GET /api/events
 * Returns: { events: EventItem[] }
 */
router.get("/api/events", async (req: Request, res: Response) => {
  if (!SHEET_ID) {
    return res.status(500).json({ error: "GOOGLE_SHEET_ID not set" });
  }

  try {
    // Google Sheets published as CSV: https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?tqx=out:csv&sheet=TAB
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not fetch sheet");
    const csv = await response.text();
    const events = csvToJson(csv);

    // Filter out blank rows (no title)
    const filteredEvents = events.filter(event => event.TITLE);

    res.json({ events: filteredEvents });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
