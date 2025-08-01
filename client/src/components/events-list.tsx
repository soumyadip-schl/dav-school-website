import { EventItem } from "@/pages/events";

function driveLinkToDirectImage(url: string | undefined): string | null {
  if (!url) return null;
  // Match file ID from "file/d/ID"
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  // For URLs like "?id=..."
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
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
          <div className="mb-4 whitespace-pre-line text-base text-gray-900">
            {(event.DESCRIPTION || event["DESCRIPTION "] || "").trim()
              ? (event.DESCRIPTION || event["DESCRIPTION "])
              : <span className="italic text-gray-400">No description</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {[event.IMG_1, event.IMG_2, event.IMG_3]
              .filter((img) => typeof img === "string" && img.trim().length > 0)
              .map((img, i) => {
                const src = driveLinkToDirectImage(img);
                console.log(`Resolved src for event "${event.TITLE}" img ${i + 1}:`, src);
                if (!src) return null;
                return (
                  <img
                    key={i}
                    src={src}
                    alt={`Event ${event.TITLE} image ${i + 1}`}
                    className="w-32 h-32 object-cover rounded bg-gray-200"
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
