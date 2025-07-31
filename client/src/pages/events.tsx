import EventsList from "@/components/events-list";
import { useEffect, useState } from "react";

export interface EventItem {
  TITLE: string;
  DESCRIPTION: string;
  IMG_1?: string;
  IMG_2?: string;
  IMG_3?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Events</h1>
          {loading ? (
            <div className="text-center">Loading events...</div>
          ) : (
            <EventsList events={events} />
          )}
        </div>
      </section>
    </div>
  );
}
