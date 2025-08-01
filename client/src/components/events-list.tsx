import { EventItem } from "@/pages/events";

function extractDriveId(url: string | undefined): string | null {
  // Handles both "file/d/ID/view" and "open?id=ID"
  if (!url) return null;
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
          {/* Multi-paragraph DESCRIPTION */}
          {(event.DESCRIPTION || "")
            .split(/\n\s*\n/) // split by double line breaks for paragraphs
            .map((paragraph, i) => (
              <p key={i} className="mb-3 whitespace-pre-line">
                {paragraph.trim()}
              </p>
            ))}
          <div className="flex flex-wrap gap-2">
            {[event.IMG_1, event.IMG_2, event.IMG_3]
              .filter((img) => !!img)
              .map((img, i) => {
                const id = extractDriveId(img);
                if (!id) return null;
                return (
                  <img
                    key={i}
                    src={`https://drive.google.com/uc?export=view&id=${id}`}
                    alt={`Event ${event.TITLE} image ${i + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
