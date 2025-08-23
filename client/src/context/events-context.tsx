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

const SHEET_ID = "13ZaNelSP0D-TE9mRrZz3umvucbvudlMJnbpAAR0pA2c";
const SHEET_TAB = "EVENTS";

const EventsContext = createContext<{ events: EventItem[]; loading: boolean }>({ events: [], loading: true });

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}`;
        const res = await fetch(url);
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
