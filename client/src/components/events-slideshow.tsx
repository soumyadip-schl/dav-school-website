import React, { useEffect, useRef, useState, useMemo } from "react";
import type { EventItem } from "../pages/events";

interface EventsSlideshowProps {
  events: (EventItem & { DATE: string })[];
  eventPageBasePath?: string;
}

const SLIDE_INTERVAL = 4000; // 4 seconds

function githubBlobToRaw(url: string): string {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!match) return url;
  const [, owner, repo, commit, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path}`;
}

const EventsSlideshow: React.FC<EventsSlideshowProps> = ({
  events,
  eventPageBasePath = "/events"
}) => {
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

  if (slides.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto relative overflow-visible rounded-xl shadow-lg mb-8 bg-white flex flex-col items-center">
        <div
          className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-t-xl"
          style={{
            minHeight: "128px",
            maxWidth: "100%",
            backgroundColor: "#e5e7eb", // Tailwind's gray-200
          }}
        >
          <span className="text-gray-500 text-lg">No image</span>
        </div>
        <div className="w-full py-4 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-dav-maroon text-center">School Events</h2>
        </div>
      </div>
    );
  }

  // Helper to get event images
  function getValidImages(event: EventItem & { DATE: string }): string[] {
    return [event.IMG_1, event.IMG_2, event.IMG_3]
      .filter(Boolean)
      .map((url) => typeof url === "string" ? githubBlobToRaw(url) : "");
  }

  // Calculate the length of the longest description, count lines/characters
  const longestDescription = slides.reduce((a, b) =>
    (a.DESCRIPTION?.length ?? 0) > (b.DESCRIPTION?.length ?? 0) ? a : b
  );
  const longestDescText = longestDescription.DESCRIPTION?.trim() ?? "";
  // Estimate number of lines based on max line breaks and wrap for long texts
  const lineCount = longestDescText
    ? Math.max(longestDescText.split('\n').length, Math.ceil(longestDescText.length / 55))
    : 1;
  // Compute height: header + img + (lines * lineHeight) + paddings + "See all events"
  const lineHeight = 20;
  const cardHeight = 52 /*header+padding*/ + 128 /*img*/ + (lineCount * lineHeight) + 48 /*bottom area*/ + 36 /*extra safe space*/;

  function renderEventCard(event: EventItem & { DATE: string }, idx: number) {
    const images = getValidImages(event);
    const displayDescription = event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description";

    return (
      <div
        className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 rounded-2xl shadow-lg overflow-hidden flex flex-col relative transition-all duration-300 cursor-pointer hover:scale-[1.01]"
        style={{
          minHeight: `${cardHeight}px`,
          height: `${cardHeight}px`,
          width: "100%",
          maxWidth: "100%",
          position: "relative"
        }}
        role="button"
        tabIndex={0}
        aria-label={`Go to events page`}
      >
        <div className="h-32 w-full bg-gray-200 flex items-center justify-center relative">
          <span
            className="absolute left-3 top-3 text-xs font-semibold bg-white/90 px-2 py-1 rounded shadow z-10"
            style={{ pointerEvents: "none" }}
          >
            {event.DATE}
          </span>
          {images.length > 0 && images[0] ? (
            <img
              src={images[0]}
              alt={`Event ${event.TITLE} image 1`}
              className="w-full h-32 object-cover rounded-t-2xl"
              draggable={false}
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
              onContextMenu={e => e.preventDefault()}
              onMouseDown={e => e.preventDefault()}
              onError={e => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/600x300?text=Image+not+found";
              }}
            />
          ) : (
            <div className="h-32 w-full bg-gray-200 flex items-center justify-center text-gray-400">
              <span>No image</span>
            </div>
          )}
        </div>
        <div className="p-4 text-left flex-1 flex flex-col relative overflow-hidden">
          <h3 className="text-lg font-bold mb-1 text-indigo-900 truncate">{event.TITLE}</h3>
          <p
            className="text-gray-700 text-sm whitespace-pre-line flex-1 break-words overflow-ellipsis"
            style={{
              textAlign: "left",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              display: "-webkit-box",
              WebkitLineClamp: lineCount,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: `${lineHeight}px`,
              maxHeight: `${lineCount * lineHeight}px`,
            }}
          >
            {displayDescription}
          </p>
          <span className="absolute right-4 bottom-3 text-xs text-indigo-600 font-semibold opacity-80 pointer-events-none">
            See all events →
          </span>
        </div>
        <a
          href={eventPageBasePath}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 40,
            cursor: "pointer",
          }}
          tabIndex={-1}
          aria-label="Go to events page"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto relative overflow-visible rounded-xl shadow-lg mb-8 bg-white">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: "100%",
          transform: `translateX(-${index * 100}%)`
        }}
      >
        {slides.map((event, i) => (
          <div
            key={i}
            className="flex-shrink-0"
            style={{
              width: "100%",
              maxWidth: "100%",
              minWidth: "100%",
              boxSizing: "border-box"
            }}
          >
            {renderEventCard(event, i)}
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 border-none outline-none shadow
              ${i === index ? "bg-indigo-600 scale-125" : "bg-indigo-200"}
            `}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            style={{ boxShadow: i === index ? "0 0 0 2px #6366f1" : undefined }}
          />
        ))}
      </div>
      {/* Prev/Next Controls */}
      <button
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-indigo-100 rounded-full shadow p-2 hover:bg-indigo-500 hover:text-white text-indigo-700 transition-all z-10"
        onClick={() => setIndex(i => (i === 0 ? slides.length - 1 : i - 1))}
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-100 rounded-full shadow p-2 hover:bg-indigo-500 hover:text-white text-indigo-700 transition-all z-10"
        onClick={() => setIndex(i => (i === slides.length - 1 ? 0 : i + 1))}
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="w-full py-4 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-dav-maroon text-center">School Events</h2>
      </div>
    </div>
  );
};

export default EventsSlideshow;
