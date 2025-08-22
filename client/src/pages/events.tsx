import React, { useEffect, useState } from "react";
import EventsList from "../components/events-list";
import Papa from "papaparse";

// Type definition for your event
export type EventItem = {
  TITLE: string;
  DESCRIPTION?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
  DATE?: string;
};

const BATCH_SIZE = 10; // Number of events to load at once

// --- CONFIGURE THESE WITH YOUR SHEET ---
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const SHEET_TAB = "EVENTS"; // Or your tab name

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Google Sheets published as CSV: https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?tqx=out:csv&sheet=TAB
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch events");
        const csv = await res.text();

        // Parse CSV using PapaParse
        const parsed = Papa.parse<EventItem>(csv, { header: true, skipEmptyLines: true, dynamicTyping: false, trimHeaders: true, });
        // Filter out blank rows (no title)
        let filteredEvents = Array.isArray(parsed.data)
          ? parsed.data.filter((event) => event.TITLE && event.TITLE.trim().length > 0)
          : [];
        // Invert the array to preserve the original order as in the CSV
        setEvents(filteredEvents.reverse());
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, events.length));
  };

  return (
    <div className="py-16 bg-dav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading for Events Page */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dav-maroon mb-4">School Events</h1>
          <p className="text-gray-600">Happenings and achievements at DAV Public School</p>
        </div>
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : (
          <>
            <EventsList events={events.slice(0, visibleCount)} />
            {visibleCount < events.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-dav-saffron text-white rounded-lg shadow hover:bg-dav-saffron/90 transition"
                >
                  Load Older Events
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
                  }
