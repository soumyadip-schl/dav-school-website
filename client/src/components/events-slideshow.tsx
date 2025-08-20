import React, { useEffect, useRef } from "react";
import type { EventItem } from "../pages/events";

// Timing for the marquee scroll
const SCROLL_SPEED = 150; // pixels per second

interface EventsSlideshowProps {
  events: (EventItem & { DATE?: string })[];
  eventPageBasePath?: string;
}

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Use .filter to only include valid events with TITLE
  const filteredEvents = events.filter(e => e && e.TITLE);

  // Only show the top 5 events from backend (first 5 in the array)
  const topEvents = filteredEvents.slice(0, 5);

  // Marquee scroll logic (auto-scroll horizontally)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || topEvents.length === 0) return;
    let req: number;
    let scrollX = 0;
    let lastTimestamp = performance.now();

    function animate(now: number) {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;
      scrollX += SCROLL_SPEED * dt;

      // Loop scroll (marquee effect)
      if (scrollX > container.scrollWidth - container.clientWidth) {
        scrollX = 0;
      }

      container.scrollLeft = scrollX;
      req = requestAnimationFrame(animate);
    }

    req = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(req);
    };
  }, [topEvents.length]);

  // Find the tallest card height for consistency
  const longestDescLength = Math.max(...topEvents.map(ev => ev.DESCRIPTION?.length || 0), 0);
  const longestDesc = topEvents.find(ev => (ev.DESCRIPTION?.length || 0) === longestDescLength)?.DESCRIPTION || "";
  const minLines = (longestDesc.match(/\n/g)?.length || 0) + Math.ceil(longestDesc.length / 50) + 1;
  const minCardHeight = 180 + 48 + (minLines * 20) + 50; // 16:9 ratio area is 180px for 320px width

  function renderEventCard(event: EventItem & { DATE?: string }, idx: number) {
    const images = [event.IMG_1, event.IMG_2, event.IMG_3]
      .filter(Boolean)
      .map((url) => typeof url === "string" ? githubBlobToRaw(url) : "");
    const displayDescription = event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description";
    return (
      <div
        key={idx}
        className="bg-white border-2 border-indigo-200 rounded-2xl shadow-lg flex flex-col relative mx-2"
        style={{
          minHeight: minCardHeight,
          minWidth: 320,
          maxWidth: 400,
          width: "320px",
          flex: "0 0 auto",
          overflow: "hidden",
        }}
      >
        <div
          className="w-full relative rounded-t-2xl overflow-hidden"
          style={{
            aspectRatio: "16/9",
            backgroundColor: "#e5e7eb", // tailwind gray-200
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {event.DATE && (
            <span
              className="absolute left-3 top-3 text-xs font-semibold bg-white/90 px-2 py-1 rounded shadow z-10"
              style={{ pointerEvents: "none" }}
            >
              {event.DATE}
            </span>
          )}
          {images.length > 0 && images[0] ? (
            <img
              src={images[0]}
              alt={`Event ${event.TITLE} image 1`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              style={{
                pointerEvents: "none",
                userSelect: "none",
                aspectRatio: "16/9",
              }}
              onContextMenu={e => e.preventDefault()}
              onMouseDown={e => e.preventDefault()}
              onError={e => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/320x180?text=Image+not+found";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 absolute inset-0">
              <span>No image</span>
            </div>
          )}
        </div>
        <div className="p-4 text-left flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
          <h3 className="text-lg font-bold mb-2 text-indigo-900">{event.TITLE}</h3>
          <p
            className="text-gray-700 text-sm whitespace-pre-line flex-1 break-words"
            style={{
              textAlign: "left",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              lineHeight: "20px",
              maxHeight: "none",
              overflow: "visible",
            }}
          >
            {displayDescription}
          </p>
          <span className="block mt-4 text-xs text-indigo-600 font-semibold opacity-80 pointer-events-none">
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

  // No events
  if (topEvents.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto bg-dav-light rounded-xl shadow-lg mb-8 px-2 md:px-4 pt-8 pb-4 flex flex-col items-center overflow-hidden">
        <div
          className="w-full relative rounded-xl"
          style={{
            aspectRatio: "16/9",
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="text-gray-500 text-lg">No Events</span>
        </div>
        <h2 className="text-2xl font-bold text-dav-maroon text-center mt-8 mb-2">School Events</h2>
      </section>
    );
  }

  // Marquee horizontal auto-flow
  return (
    <section className="w-full max-w-7xl mx-auto bg-dav-light rounded-xl shadow-lg mb-8 px-2 md:px-4 pt-8 pb-4 flex flex-col items-center overflow-hidden">
      <div
        className="w-full flex flex-row flex-nowrap items-stretch"
        ref={containerRef}
        style={{
          overflowX: "hidden",
          minHeight: minCardHeight + 24,
          width: "100%",
        }}
      >
        {topEvents.map((event, idx) => renderEventCard(event, idx))}
        {/* Optionally repeat cards for seamless loop */}
        {topEvents.length > 1 && topEvents.map((event, idx) => renderEventCard(event, idx + topEvents.length))}
      </div>
      <h2 className="text-2xl font-bold text-dav-maroon text-center mt-8 mb-2">School Events</h2>
    </section>
  );
};

export default EventsSlideshow;
