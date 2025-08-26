import React, { createContext, useContext, useEffect, useState } from "react";
import Papa from "papaparse";

export type EventItem = {
  TITLE: string;
  DESCRIPTION?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
  DATE?: string;
};

// Directly use the published EVENTS tab CSV link:
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTjx0OELHphVP3nveBTztwOPxIn4kCLc0VYv35dbl8Qyf7KF6PNwqbCj7NZL9C-7T8ySMf0Q25_ZCVA/pub?output=csv";

const EventsContext = createContext<{ events: EventItem[]; loading: boolean }>({ events: [], loading: true });

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        if (!res.ok) throw new Error("Failed to fetch events");
        const csv = await res.text();
        const parsed = Papa.parse<EventItem>(csv, { header: true, skipEmptyLines: true, dynamicTyping: false, trimHeaders: true });
        let filteredEvents = Array.isArray(parsed.data)
          ? parsed.data.filter((event) => event.TITLE && event.TITLE.trim().length > 0)
          : [];
        setEvents(filteredEvents.reverse());
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
