import { EventItem } from "@/pages/events";

// Extract Google Drive file ID and validate the URL
function extractDriveId(url: string | undefined): string | null {
  if (!url) return null;
  // Handles "file/d/ID" and "open?id=ID"
  const fileMatch = url.match(/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return null;
}

export default function EventsList({ events }: { events: EventItem[] }) {
  if (!events.length) return <div>No events found.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col"
        >
          <h2 className="text-xl font-semibold mb-2">{event.TITLE}</h2>
          {/* Always show DESCRIPTION with preserved line breaks */}
          <div className="mb-4 whitespace-pre-line text-base text-gray-900">
            {event.DESCRIPTION?.trim() ? event.DESCRIPTION : <span className="italic text-gray-400">No description</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {[event.IMG_1, event.IMG_2, event.IMG_3]
              .filter((img) => typeof img === "string" && img.trim() !== "")
              .map((img, i) => {
                const id = extractDriveId(img);
                if (!id) return null;
                // For Google Drive images, construct a direct link
                const src = `https://drive.google.com/uc?export=view&id=${id}`;
                return (
                  <img
                    key={i}
                    src={src}
                    alt={`Event ${event.TITLE} image ${i + 1}`}
                    className="w-32 h-32 object-cover rounded bg-gray-200"
                    onError={(e) => {
                      // fallback to nothing if image is broken
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
                }
