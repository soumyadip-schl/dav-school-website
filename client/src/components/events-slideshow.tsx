import React, { useEffect, useRef, useState } from "react";
import type { EventItem } from "../pages/events";

/**
 * Props for EventsSlideshow.
 * - events: Array of events, already sorted and formatted as in EventsList.
 * - onEventClick: Function called when a slide is clicked (should handle navigation to the specific event).
 */
interface EventsSlideshowProps {
  events: (EventItem & { DATE: string })[];
  onEventClick?: (event: EventItem & { DATE: string }, idx: number) => void;
  eventPageBasePath?: string; // For fallback link if onEventClick is not provided
}

const SLIDE_INTERVAL = 4000; // 4 seconds

const EventsSlideshow: React.FC<EventsSlideshowProps> = ({
  events,
  onEventClick,
  eventPageBasePath = "/events"
}) => {
  // Top 5 newest events (assuming already sorted by EventsList)
  const slides = events.slice(0, 5);

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-slide logic
  useEffect(() => {
    if (slides.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, slides.length]);

  if (slides.length === 0) return null;

  // Helper to get event link (fallback only)
  function getEventLink(event: EventItem & { DATE: string }, idx: number): string {
    if ("id" in event) return `${eventPageBasePath}/${(event as any).id}`;
    return `${eventPageBasePath}#event-${idx}`;
  }

  // Render minimized card (similar to minimized in EventsList)
  function renderMinimizedCard(event: EventItem & { DATE: string }, idx: number) {
    const images = [event.IMG_1, event.IMG_2, event.IMG_3].filter(Boolean);
    const fullDescription = event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description";
    const shortDescription =
      fullDescription.length > 110 ? fullDescription.slice(0, 110) + "..." : fullDescription;

    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative transition-all duration-300 cursor-pointer group"
        style={{
          minHeight: "170px",
          maxHeight: "210px",
          opacity: 0.93,
          margin: "0 8px",
          width: "320px"
        }}
        onClick={() => onEventClick ? onEventClick(event, idx) : window.location.assign(getEventLink(event, idx))}
        tabIndex={0}
        aria-label={`Go to event: ${event.TITLE}`}
      >
        <div className="h-32 w-full bg-gray-100 flex items-center justify-center relative">
          {images.length > 0 && images[0] ? (
            <img
              src={images[0]}
              alt={`Event ${event.TITLE} image 1`}
              style={{
                width: "100%",
                height: "8rem",
                objectFit: "cover",
                borderRadius: "0.5rem 0.5rem 0 0",
                pointerEvents: "none",
                userSelect: "none",
              }}
              draggable={false}
              onContextMenu={e => e.preventDefault()}
              onMouseDown={e => e.preventDefault()}
            />
          ) : (
            <div className="h-32 w-full bg-gray-200 flex items-center justify-center text-gray-400">
              <span>No image</span>
            </div>
          )}
        </div>
        <div className="p-3 text-left flex-1 flex flex-col relative">
          <h3 className="text-base font-semibold mb-1">{event.TITLE}</h3>
          <p className="text-gray-700 text-sm whitespace-pre-line flex-1" style={{ textAlign: "left" }}>
            {shortDescription}
          </p>
          {/* Date at bottom left */}
          <span
            className="absolute left-3 bottom-3 text-xs text-gray-500 font-medium bg-white/80 px-2 py-0.5 rounded shadow"
            style={{ pointerEvents: "none" }}
          >
            {event.DATE}
          </span>
        </div>
        <span className="absolute right-4 bottom-3 text-xs text-indigo-600 font-medium opacity-80 group-hover:underline">
          Read more
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative overflow-hidden rounded-xl shadow-lg mb-8">
      {/* Slides container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${slides.length * 340}px`,
          transform: `translateX(-${index * 340}px)`
        }}
      >
        {slides.map((event, i) => (
          <div key={i} style={{ minWidth: "320px", maxWidth: "320px" }}>
            {renderMinimizedCard(event, i)}
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 border-none outline-none shadow
              ${i === index ? "bg-indigo-600 scale-125" : "bg-white/70"}
            `}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            style={{ boxShadow: i === index ? "0 0 0 2px #6366f1" : undefined }}
          />
        ))}
      </div>
      {/* Prev/Next Controls */}
      <button
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full shadow p-2 hover:bg-indigo-500 hover:text-white text-gray-700 transition-all z-10"
        onClick={() => setIndex(i => (i === 0 ? slides.length - 1 : i - 1))}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full shadow p-2 hover:bg-indigo-500 hover:text-white text-gray-700 transition-all z-10"
        onClick={() => setIndex(i => (i === slides.length - 1 ? 0 : i + 1))}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
};

export default EventsSlideshow;
