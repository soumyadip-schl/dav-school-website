import React, { useState } from "react";
import type { EventItem } from "../pages/events";

// Converts GitHub blob to raw
function githubBlobToRaw(url: string): string {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!match) return url;
  const [, owner, repo, commit, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path}`;
}

interface Props {
  events: (EventItem & { DATE: string })[];
}

// Dot indicator for slideshow
const Dot = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-2 w-2 rounded-full mx-1 transition-all duration-200 border-none outline-none ${
      active ? "bg-indigo-600 scale-125 shadow-lg" : "bg-gray-300"
    }`}
    aria-label="Show image"
    tabIndex={-1}
  />
);

// Clamp description for minimized mode (visual clamp for 2 lines, with JS fallback for ".....")
function clampDescription(desc: string, maxChars = 120) {
  if (!desc) return "";
  if (desc.length > maxChars) return desc.slice(0, maxChars).replace(/\s+$/, "") + ".....";
  return desc;
}

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;
  const sortedEvents = [...events].reverse();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  // Ensure slideshow is always controlled per card, and not lost on expand/collapse.
  const [slideIndexes, setSlideIndexes] = useState<{ [key: number]: number }>({});

  const handlePrevSlide = (idx: number, images: string[]) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [idx]:
        prev[idx] === undefined
          ? images.length - 1
          : prev[idx] === 0
          ? images.length - 1
          : prev[idx] - 1,
    }));
  };

  const handleNextSlide = (idx: number, images: string[]) => {
    setSlideIndexes((prev) => ({
      ...prev,
      [idx]:
        prev[idx] === undefined
          ? 1 % images.length
          : (prev[idx] + 1) % images.length,
    }));
  };

  // Fix: Always keep slideshow state, never re-key or remount cards!
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEvents.map((event, idx) => {
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .filter(Boolean)
          .map(url => url ? githubBlobToRaw(url) : "");
        const fullDescription = event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description";
        const isExpanded = expandedIdx === idx;

        // Slide index per card
        const slideIndex = slideIndexes[idx] ?? 0;
        const needsShowMore = fullDescription.length > 120;

        // For minimized: clamp visually, and add "....." at the end
        const displayDescription = isExpanded
          ? fullDescription
          : clampDescription(fullDescription);

        return (
          <div
            key={event.TITLE + "_" + idx} // Stable key is important!
            className={`
              bg-white rounded-2xl shadow-md overflow-hidden flex flex-col relative transition
              duration-300 ${isExpanded ? "ring-2 ring-indigo-400 scale-[1.01] z-10 shadow-xl" : "hover:shadow-lg"}
            `}
            tabIndex={0}
            style={{
              minHeight: isExpanded ? "340px" : "250px",
              maxHeight: isExpanded ? "none" : "290px",
              outline: "none"
            }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse event" : "Expand event"}
          >
            {/* Date badge */}
            <span
              className="absolute left-4 top-4 text-xs font-semibold bg-white/90 px-2 py-1 rounded shadow z-10"
              style={{ pointerEvents: "none" }}
            >
              {event.DATE}
            </span>
            {/* Image with slideshow */}
            <div className="h-48 w-full bg-gray-100 flex items-center justify-center relative">
              {images.length > 0 && images[slideIndex] ? (
                <>
                  <img
                    src={images[slideIndex]}
                    alt={`Event ${event.TITLE} image ${slideIndex + 1}`}
                    className="w-full h-full object-cover rounded-t-2xl"
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                    onMouseDown={e => e.preventDefault()}
                    style={{
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={e => { e.stopPropagation(); handlePrevSlide(idx, images); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full shadow p-2 hover:bg-indigo-500 hover:text-white text-gray-700 transition-all"
                        style={{ zIndex: 2 }}
                        aria-label="Previous image"
                        tabIndex={0}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleNextSlide(idx, images); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full shadow p-2 hover:bg-indigo-500 hover:text-white text-gray-700 transition-all"
                        style={{ zIndex: 2 }}
                        aria-label="Next image"
                        tabIndex={0}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex z-10">
                        {images.map((_, i) => (
                          <Dot key={i} active={i === slideIndex} onClick={e => { e.stopPropagation(); setSlideIndexes(sl => ({ ...sl, [idx]: i })); }} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
            {/* Content */}
            <div className="p-4 text-left flex-1 flex flex-col relative">
              {/* Title */}
              <h3 className="text-lg font-bold mb-2 text-black">{event.TITLE}</h3>
              {/* Description */}
              <div
                className={`text-gray-600 flex-1 mb-2 transition-all`}
                style={
                  isExpanded
                    ? { textAlign: "left", whiteSpace: "pre-line", fontSize: "1em", minHeight: "2.4em" }
                    : {
                        textAlign: "left",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "2.4em",
                        fontSize: "1em",
                        whiteSpace: "pre-line",
                      }
                }
              >
                {displayDescription}
              </div>
              {/* Spacer to push button down */}
              <div className="flex-1" />
              {/* Show More / Show Less */}
              {needsShowMore && (
                <div className="flex justify-start mt-4">
                  <button
                    className="px-4 py-1 border border-indigo-300 rounded-md text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-sm transition"
                    onClick={e => {
                      e.stopPropagation();
                      setExpandedIdx(isExpanded ? null : idx);
                    }}
                    tabIndex={0}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
