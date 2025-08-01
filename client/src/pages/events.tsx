// pages/events.tsx
import React, { useEffect, useState } from "react";
import EventsList from "@/components/events-list";

// Define the type for an event; you can adjust the keys if needed.
export interface EventItem {
  TITLE: string;
  DESCRIPTION?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events"); // Ensure this route returns your event JSON
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: EventItem[] = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }

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
