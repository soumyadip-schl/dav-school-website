import React, { useEffect, useState } from "react";
import EventsList from "../components/events-list";

// Alias type for API event objects (matching your backend)
export type EventItem = {
  TITLE: string;
  DESCRIPTION?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        // Expecting { events: EventItem[] }
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : (
        <EventsList events={events} />
      )}
    </div>
  );
}
