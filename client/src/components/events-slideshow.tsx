import React, { useEffect, useRef, useState } from "react";
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
  const slides = events.slice(0, 20); // Show up to 20 events if needed
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Responsive: how many cards per view?
  // We use window.innerWidth; fallback to 1 if SSR
  const [cardsPerView, setCardsPerView] = useState(1);
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w >= 1800) setCardsPerView(5);
      else if (w >= 1280) setCardsPerView(4);
      else if (w >= 900) setCardsPerView(3);
      else if (w >= 600) setCardsPerView(2);
      else setCardsPerView(1);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide logic, no manual controls
  useEffect(() => {
    if (slides.length <= cardsPerView) return;
    timeoutRef.current = setTimeout(() => {
      setIndex(prev =>
        prev + cardsPerView >= slides.length
          ? 0
          : prev + cardsPerView
      );
    }, SLIDE_INTERVAL);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, cardsPerView, slides.length]);

  // Card height: tallest description (to avoid uneven heights)
  const longestDescLength = Math.max(...slides.map(ev => ev.DESCRIPTION?.length || 0), 0);
  const longestDesc = slides.find(ev => (ev.DESCRIPTION?.length || 0) === longestDescLength)?.DESCRIPTION || "";
  const minLines = (longestDesc.match(/\n/g)?.length || 0) + Math.ceil(longestDesc.length / 50) + 1;
  const minCardHeight = 128 + 48 + (minLines * 20) + 50;

  // Helper to get event images
  function getValidImages(event: EventItem & { DATE: string }): string[] {
    return [event.IMG_1, event.IMG_2, event.IMG_3]
      .filter(Boolean)
      .map((url) => typeof url === "string" ? githubBlobToRaw(url) : "");
  }

  function renderEventCard(event: EventItem & { DATE: string }, idx: number) {
    const images = getValidImages(event);
    const displayDescription = event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description";
    return (
      <div
        key={idx}
        className="bg-white border-2 border-indigo-200 rounded-2xl shadow-lg flex flex-col relative w-full overflow-hidden"
        style={{
          minHeight: minCardHeight,
          height: "auto",
          maxWidth: "100%",
        }}
        role="button"
        tabIndex={0}
        aria-label={`Go to events page`}
      >
        <div className="h-32 w-full bg-gray-200 flex items-center justify-center relative rounded-t-2xl overflow-hidden">
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
              className="w-full h-32 object-cover"
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

  // No events placeholder
  if (slides.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto bg-dav-light rounded-xl shadow-lg mb-8 px-2 md:px-4 pt-8 pb-4 flex flex-col items-center overflow-hidden">
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-xl">
          <span className="text-gray-500 text-lg">No Events</span>
        </div>
        <h2 className="text-2xl font-bold text-dav-maroon text-center mt-8 mb-2">School Events</h2>
      </section>
    );
  }

  // Show the active set of cards for the current index
  const visibleCards = slides.slice(index, index + cardsPerView);
  // If we run out of cards at the end, wrap from the start
  if (visibleCards.length < cardsPerView && slides.length > 0) {
    visibleCards.push(...slides.slice(0, cardsPerView - visibleCards.length));
  }

  return (
    <section className="w-full max-w-7xl mx-auto bg-dav-light rounded-xl shadow-lg mb-8 px-2 md:px-4 pt-8 pb-4 flex flex-col items-center overflow-hidden">
      <div
        className="w-full flex flex-row gap-6 justify-center items-stretch"
        style={{ overflow: "hidden" }}
      >
        {visibleCards.map((event, idx) => (
          <div
            key={idx}
            className="flex-shrink-0"
            style={{
              width: `${100 / cardsPerView}%`,
              maxWidth: `${100 / cardsPerView}%`,
              minWidth: 0,
              display: "flex",
            }}
          >
            {renderEventCard(event, idx)}
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold text-dav-maroon text-center mt-8 mb-2">School Events</h2>
    </section>
  );
};

export default EventsSlideshow;
