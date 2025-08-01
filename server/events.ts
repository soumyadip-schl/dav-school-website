import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync"; // <-- NEW!

const router = Router();

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || "EVENTS";

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

    // Use robust CSV parser to handle quoted fields and newlines
    const events = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Filter out blank rows (no title)
    const filteredEvents = events.filter((event: any) => event.TITLE && event.TITLE.trim().length > 0);

    res.json({ events: filteredEvents });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
