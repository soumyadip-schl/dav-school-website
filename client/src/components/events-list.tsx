import { EventItem } from "@/pages/events";

// Converts a Google Drive sharing link like:
// https://drive.google.com/file/d/1BzaojA2FClSumRvvqY0zwVDLady228SJ/view?usp=drivesdk
// to a direct image link for embedding in <img src="...">
function driveLinkToDirectImage(url: string | undefined): string | null {
  if (!url) return null;
  // Extracts the file ID from the Google Drive link
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return null;
}

export default function EventsList({ events }: { events: EventItem[] }) {
  if (!events || !events.length) return <div>No events found.</div>;

  return (
    <div className="flex flex-col gap-8">
      {events.map((event, idx) => {
        // Collect all image links and convert them to direct links
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .filter((img) => typeof img === "string" && img.trim().length > 0)
          .map((img) => driveLinkToDirectImage(img))
          .filter(Boolean) as string[];

        return (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-0 flex flex-col overflow-hidden max-w-xl mx-auto"
          >
            {/* Show the first image big at the top if available */}
            {images.length > 0 && (
              <img
                src={images[0]}
                alt={`Event ${event.TITLE} image`}
                className="w-full h-64 object-cover bg-gray-200"
                style={{ objectFit: "cover", width: "100%", height: "16rem" }}
                onError={e => { 
                  // fallback: hide on error
                  (e.currentTarget as HTMLImageElement).style.display = 'none'; 
                }}
              />
            )}

            <div className="p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-2 text-center">{event.TITLE}</h2>
              <div className="whitespace-pre-line text-base text-gray-900 text-center">
                {(event.DESCRIPTION || event["DESCRIPTION "] || "").trim()
                  ? (event.DESCRIPTION || event["DESCRIPTION "])
                  : <span className="italic text-gray-400">No description</span>}
              </div>
              {/* If there are more images, show them below the description */}
              {images.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {images.slice(1).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Event ${event.TITLE} image ${i + 2}`}
                      className="w-32 h-32 object-cover rounded bg-gray-200"
                      onError={e => { 
                        // fallback: hide on error
                        (e.currentTarget as HTMLImageElement).style.display = 'none'; 
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
