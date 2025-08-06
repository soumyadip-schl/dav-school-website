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
        // Reverse the array then take the first 5
        const reversedEvents = [...filteredEvents].reverse();
        setEvents(reversedEvents);
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
      <div className="mt-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : (
          <EventsSlideshow events={events.slice(0, 5)} eventPageBasePath="/events" />
        )}
      </div>
      <PrincipalMessage />
      <ImageGallery />
    </div>
  );
}
