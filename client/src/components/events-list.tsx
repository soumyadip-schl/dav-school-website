import React from "react";
import type { EventItem } from "../pages/events";

/**
 * Converts a GitHub blob link at a specific commit to a raw file URL.
 * Supports links like:
 * https://github.com/owner/repo/blob/commit/path/to/file.png
 * Converts to:
 * https://raw.githubusercontent.com/owner/repo/commit/path/to/file.png
 */
function githubBlobToRaw(url: string): string {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (!match) return url; // If not a GitHub blob link, return as is
  const [, owner, repo, commit, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${path}`;
}

interface Props {
  events: EventItem[];
}

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, idx) => {
        // Convert all images if they are GitHub blob links
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .filter(Boolean)
          .map(url => url ? githubBlobToRaw(url) : "");

        return (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            {images.length > 0 && images[0] ? (
              <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
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
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                  }}
                />
              </div>
            ) : (
              <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span>No image available</span>
              </div>
            )}
            <div className="p-4 text-left">
              <h3 className="text-xl font-semibold mb-2">{event.TITLE}</h3>
              <p
                className="text-gray-700 whitespace-pre-line"
                style={{ textAlign: "left" }}
              >
                {event.DESCRIPTION ? event.DESCRIPTION.trim() : "No description"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
