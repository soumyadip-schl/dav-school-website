import React, { useState } from "react";
import type { EventItem } from "../pages/events";

function githubBlobToRaw(url: string): string {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!match) return url;
  const [, owner, repo, commit, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path}`;
}

interface Props {
  events: (EventItem & { DATE: string })[];
}

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;
  const sortedEvents = [...events].reverse();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEvents.map((event, idx) => {
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .filter(Boolean)
          .map(url => url ? githubBlobToRaw(url) : "");
        const fullDescription = event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description";
        const isExpanded = expandedIdx === idx;

        return (
          <div
            key={idx}
            className={`
              bg-white rounded-2xl shadow-md overflow-hidden flex flex-col relative transition
              duration-300 ${isExpanded ? "ring-2 ring-indigo-400 scale-[1.01] z-10 shadow-xl" : "hover:shadow-lg"}
              cursor-pointer
            `}
            tabIndex={0}
            style={{
              minHeight: isExpanded ? "320px" : "210px",
              maxHeight: isExpanded ? "none" : "260px",
              opacity: isExpanded ? 1 : 0.98,
              outline: "none"
            }}
            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") setExpandedIdx(isExpanded ? null : idx);
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
            {/* Image */}
            <div className="h-48 w-full bg-gray-100 flex items-center justify-center relative">
              {images.length > 0 && images[0] ? (
                <img
                  src={images[0]}
                  alt={`Event ${event.TITLE} image 1`}
                  className="w-full h-full object-cover rounded-t-2xl"
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                  onMouseDown={e => e.preventDefault()}
                  style={{
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
            {/* Content */}
            <div className="p-4 text-left flex-1 flex flex-col relative">
              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 text-indigo-800">{event.TITLE}</h3>
              {/* Description */}
              <p
                className={`
                  text-gray-700 whitespace-pre-line flex-1 mb-2 transition-all
                  ${isExpanded ? "" : "line-clamp-2"}
                `}
                style={
                  isExpanded
                    ? { textAlign: "left", minHeight: "2.4em" }
                    : {
                        textAlign: "left",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: "2.4em",
                        fontSize: "0.97em"
                      }
                }
              >
                {fullDescription}
              </p>
              {/* Show More / Show Less */}
              {fullDescription.length > 60 && (
                <button
                  className="mt-1 px-3 py-1 border border-indigo-300 rounded-md text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-sm transition"
                  style={{
                    position: "absolute",
                    left: 18,
                    bottom: 10,
                    fontSize: "1em",
                    cursor: "pointer",
                  }}
                  tabIndex={0}
                  onClick={e => {
                    e.stopPropagation();
                    setExpandedIdx(isExpanded ? null : idx);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      setExpandedIdx(isExpanded ? null : idx);
                    }
                  }}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
              {/* Subtle divider for pro look */}
              {!isExpanded && <div className="absolute right-4 bottom-4 h-1 w-8 bg-indigo-100 rounded-full opacity-60" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
