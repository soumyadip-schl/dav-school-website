// components/events-list.tsx
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { EventItem } from "@/pages/events";

// Function to convert a Google Drive sharing link to a direct embed link.
function driveLinkToDirectImage(url: string | undefined): string | null {
  if (!url) return null;
  // Match the file ID from a URL like: /file/d/FILE_ID/view?usp=drivesdk
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  // Alternatively, match if the URL contains ?id=FILE_ID
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }
  return null;
}

export default function EventsList({ events }: { events: EventItem[] }) {
  if (!events || events.length === 0) return <div>No events found.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, idx) => {
        // Process image links from Google Drive.
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .filter((img) => typeof img === "string" && img.trim().length > 0)
          .map((img) => driveLinkToDirectImage(img))
          .filter(Boolean) as string[];

        return (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-0 flex flex-col overflow-hidden"
          >
            {images.length > 0 && (
              <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                autoPlay={images.length > 1}
                interval={4000}
                swipeable
                emulateTouch
                className="w-full aspect-square"
              >
                {images.map((src, i) => (
                  <div key={i} className="w-full h-64 bg-gray-200">
                    <img
                      src={src}
                      alt={`Event ${event.TITLE} image ${i + 1}`}
                      className="object-cover w-full h-64"
                      style={{ objectFit: "cover", width: "100%", height: "16rem" }}
                      onError={(e) => {
                        // Hide image if there's an error loading it.
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            )}
            <div className="p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-2 text-center">{event.TITLE}</h2>
              <div className="whitespace-pre-line text-base text-gray-900 text-center">
                {(event.DESCRIPTION || event["DESCRIPTION "] || "").trim() ? (
                  event.DESCRIPTION || event["DESCRIPTION "]
                ) : (
                  <span className="italic text-gray-400">No description</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
