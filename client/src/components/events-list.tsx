import React, { useState } from "react";
import type { EventItem } from "../pages/events";

/**
 * Converts a GitHub blob link at a specific commit to a raw file URL.
 */
function githubBlobToRaw(url: string): string {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!match) return url;
  const [, owner, repo, commit, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path}`;
}

interface Props {
  events: (EventItem & { DATE: string })[]; // Backend now provides DATE
}

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  // Sort: newest post (last in data) is shown first
  const sortedEvents = [...events].reverse();
  // Track which event is expanded (full length). Default: first (newest) expanded.
  const [expandedIdx, setExpandedIdx] = useState(0);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEvents.map((event, idx) => {
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .filter(Boolean)
          .map(url => url ? githubBlobToRaw(url) : "");
        const isExpanded = expandedIdx === idx;

        // Description logic
        const fullDescription = event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description";
        const shortDescription = fullDescription.length > 180 ? fullDescription.slice(0, 180) + "..." : fullDescription;

        return (
          <div
            key={idx}
            className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 relative ${
              isExpanded ? "ring-2 ring-indigo-400 scale-[1.01] z-10" : ""
            }`}
            style={{
              minHeight: isExpanded ? "320px" : "180px",
              maxHeight: isExpanded ? "none" : "210px",
              opacity: isExpanded ? 1 : 0.9,
            }}
          >
            <div className="h-64 w-full bg-gray-100 flex items-center justify-center relative">
              {images.length > 0 && images[0] ? (
                <img
                  src={images[0]}
                  alt={`Event ${event.TITLE} image 1`}
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                  onMouseDown={e => e.preventDefault()}
                  style={{
                    width: "100%",
                    height: "16rem",
                    objectFit: "cover",
                    pointerEvents: "none",
                    userSelect: "none",
                    borderRadius: "0.5rem",
                  }}
                />
              ) : (
                <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
            <div className="p-4 text-left flex-1 flex flex-col relative">
              <h3 className="text-xl font-semibold mb-2">{event.TITLE}</h3>
              <p className="text-gray-700 whitespace-pre-line flex-1" style={{ textAlign: "left" }}>
                {isExpanded ? fullDescription : shortDescription}
              </p>
              {/* Read more / Show less */}
              {fullDescription.length > 180 && (
                <button
                  className="mt-2 text-indigo-600 font-medium hover:underline text-left"
                  onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
              {/* Date at bottom left */}
              <span
                className="absolute left-4 bottom-4 text-xs text-gray-500 font-medium bg-white/80 px-2 py-1 rounded shadow"
                style={{ pointerEvents: "none" }}
              >
                {event.DATE}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
