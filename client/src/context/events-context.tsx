import React, { createContext, useContext, useEffect, useState } from "react";

export type EventItem = {
  TITLE: string;
  DESCRIPTION?: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
  DATE?: string;
};

const EVENTS_JSON_URL = "https://raw.githubusercontent.com/soumyadip-schl/assets-dav/dc7d193c6d050e0f92b32f050ad447608f5c8230/events/events.json";

const EventsContext = createContext<{ events: EventItem[]; loading: boolean }>({ events: [], loading: true });

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(EVENTS_JSON_URL);
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
    fetchEvents();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
