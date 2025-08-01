import { EventItem } from "@/pages/events";

// Helper to convert Google Drive share link to direct image link
function driveLinkToDirectImage(url: string | undefined): string | null {
  if (!url) return null;
  // Match the file ID from "file/d/ID/"
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return null;
}

export default function EventsList({ events }: { events: EventItem[] }) {
  if (!events || !events.length) return <div>No events found.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col"
        >
          <h2 className="text-xl font-semibold mb-2">{event.TITLE}</h2>
          {/* Use the exact DESCRIPTION key, with or without trailing space */}
          <div className="mb-4 whitespace-pre-line text-base text-gray-900">
            {(event.DESCRIPTION || event["DESCRIPTION "] || "").trim()
              ? (event.DESCRIPTION || event["DESCRIPTION "])
              : <span className="italic text-gray-400">No description</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {[event.IMG_1, event.IMG_2, event.IMG_3]
              .filter((img) => typeof img === "string" && img.trim().startsWith("http"))
              .map((img, i) => {
                const src = driveLinkToDirectImage(img);
                if (!src) return null;
                return (
                  <img
                    key={i}
                    src={src}
                    alt={`Event ${event.TITLE} image ${i + 1}`}
                    className="w-32 h-32 object-cover rounded bg-gray-200"
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
