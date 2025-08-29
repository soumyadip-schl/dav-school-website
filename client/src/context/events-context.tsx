import React, { createContext, useContext, useEffect, useState, useRef } from "react";

export type EventItem = {
  TITLE: string;
  DESCRIPTION?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
  DATE?: string;
};

const EVENTS_JSON_URL =
  "https://raw.githubusercontent.com/soumyadip-schl/assets-dav/main/events/events.json";

const EventsContext = createContext<{ events: EventItem[]; loading: boolean }>({ events: [], loading: true });

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to fetch with cache busting
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Force a cache-busting param (timestamp)
      const url = `${EVENTS_JSON_URL}?_=${Date.now()}`;
      const res = await fetch(url, { cache: "reload" });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      const filteredEvents = Array.isArray(data)
        ? data.filter((event) => event.TITLE && event.TITLE.trim().length > 0)
        : [];
      setEvents(filteredEvents.reverse());
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Set up refresh every 6 hours (21600000 ms)
    intervalRef.current = setInterval(fetchEvents, 6 * 60 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
