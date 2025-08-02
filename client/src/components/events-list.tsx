import React from "react";
import type { EventItem } from "../pages/events";

interface Props {
  events: EventItem[];
}

const iframeBlockerScript = `
  document.addEventListener('contextmenu', event => event.preventDefault());
  document.addEventListener('keydown', function(e){
    // Block zoom: Ctrl/Cmd + '+', '-', '0', and scroll/zoom
    if ((e.ctrlKey || e.metaKey) && 
      (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0' || e.key === 'Scroll' || e.key === 'Wheel')) {
      e.preventDefault();
    }
    // Block F12, Ctrl+Shift+I/J/C/U, Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && (e.shiftKey && ['I', 'J', 'C', 'U'].includes(e.key))) ||
      ((e.ctrlKey || e.metaKey) && ['u', 's', 'p', 'U', 'S', 'P'].includes(e.key))
    ) {
      e.preventDefault();
    }
  });
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';
  document.body.style.msUserSelect = 'none';
  document.body.style.overflow = 'hidden';
`;

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, idx) => {
        const images = [event.IMG_1, event.IMG_2, event.IMG_3].filter(Boolean);

        return (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            {images.length > 0 ? (
              <div className="h-64 w-full bg-gray-100 flex items-center justify-center relative">
                <iframe
                  src={images[0]}
                  width="100%"
                  height="256"
                  allow="autoplay"
                  sandbox="allow-scripts"
                  style={{
                    border: 0,
                    pointerEvents: "none", // disables interaction inside iframe (prevents zoom, right click, open in new tab, etc.)
                  }}
                  title={`Event ${event.TITLE} image 1`}
                ></iframe>
                {/* Block right click and drag on the iframe area itself */}
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    width: "100%", height: "100%",
                    zIndex: 10,
                  }}
                  onContextMenu={e => e.preventDefault()}
                  onMouseDown={e => e.preventDefault()}
                  onDragStart={e => e.preventDefault()}
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
      {/* Block right click, zoom, select, etc at the document level */}
      <script dangerouslySetInnerHTML={{ __html: iframeBlockerScript }} />
    </div>
  );
};

export default EventsList;
