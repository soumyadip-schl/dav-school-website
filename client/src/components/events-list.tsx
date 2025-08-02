import React, { useState } from "react";
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

// Fancy dot indicators for slideshow
const Dot = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-2 w-2 rounded-full mx-1 transition-all duration-200 border-none outline-none ${
      active ? "bg-indigo-600 scale-125 shadow-lg" : "bg-gray-300"
    }`}
    aria-label="Show image"
  />
);

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  // Sort so newest post (by assumed timestamp or id) is first
  // If EventItem has a timestamp property, use it. Otherwise, use array order reversed.
  const sortedEvents = [...events].reverse();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedEvents.map((event, idx) => {
        // Convert all images if they are GitHub blob links
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .filter(Boolean)
          .map(url => url ? githubBlobToRaw(url) : "");
        // Slideshow state: index of current image
        const [slideIndex, setSlideIndex] = useState(0);

        // Slide controls
        const prevSlide = (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          setSlideIndex(i => (i === 0 ? images.length - 1 : i - 1));
        };
        const nextSlide = (e?: React.MouseEvent) => {
          if (e) e.stopPropagation();
          setSlideIndex(i => (i === images.length - 1 ? 0 : i + 1));
        };
        // Auto-advance every 5s
        React.useEffect(() => {
          if (images.length <= 1) return;
          const timer = setTimeout(() => setSlideIndex(i => (i === images.length - 1 ? 0 : i + 1)), 5000);
          return () => clearTimeout(timer);
        }, [slideIndex, images.length]);

        return (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="h-64 w-full bg-gray-100 flex items-center justify-center relative">
              {images.length > 0 && images[slideIndex] ? (
                <>
                  <img
                    src={images[slideIndex]}
                    alt={`Event ${event.TITLE} image ${slideIndex + 1}`}
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
                      borderRadius: "0.5rem",
                      boxShadow: "0 2px 8px 0 #0002",
                      transition: "all .3s cubic-bezier(.4,2,.6,1)",
                    }}
                  />
                  {images.length > 1 && (
                    <>
                      {/* Prev Button */}
                      <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full shadow p-1.5 hover:bg-indigo-500 hover:text-white text-gray-700 transition-all"
                        style={{ zIndex: 2 }}
                        aria-label="Previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      {/* Next Button */}
                      <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full shadow p-1.5 hover:bg-indigo-500 hover:text-white text-gray-700 transition-all"
                        style={{ zIndex: 2 }}
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex z-10">
                        {images.map((_, i) => (
                          <Dot key={i} active={i === slideIndex} onClick={e => { e.stopPropagation(); setSlideIndex(i); }} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span>No image available</span>
                </div>
              )}
            </div>
            <div className="p-4 text-left flex-1 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">{event.TITLE}</h3>
              <p
                className="text-gray-700 whitespace-pre-line flex-1"
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
