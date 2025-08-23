import React, { useState } from "react";
import EventsList from "../components/events-list";
import { useEvents } from "../context/events-context";

const BATCH_SIZE = 10;

export default function EventsPage() {
  const { events, loading } = useEvents();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, events.length));
  };

  return (
    <div className="py-16 bg-dav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dav-maroon mb-4">School Events</h1>
          <p className="text-gray-600">Happenings and achievements at DAV Public School</p>
        </div>
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : (
          <>
            <EventsList
              events={events.slice(0, visibleCount)}
              descriptionClass="text-xs" // 1 unit smaller, pass this prop to EventsList and use on description
            />
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
