import React, { useEffect, useState } from "react";
import HeroSection from "@/components/hero-section";
import EventsSlideshow from "../components/events-slideshow";
import PrincipalMessage from "@/components/principal-message";
import ImageGallery from "@/components/image-gallery";
import type { EventItem } from "./events";

export default function Home() {
  const [events, setEvents] = useState<(EventItem & { DATE: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        const filteredEvents = Array.isArray(data.events)
          ? data.events.filter((e) => e && e.TITLE && e.DATE)
          : [];
        // Sort by date descending (latest first)
        const sortedEvents = filteredEvents.sort(
          (a, b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime()
        );
        setEvents(sortedEvents);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <HeroSection />
      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : (
        <EventsSlideshow events={events.slice(0, 5)} />
      )}
      <PrincipalMessage />
      <ImageGallery />
    </div>
  );
}
