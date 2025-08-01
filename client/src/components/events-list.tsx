import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import type { EventItem } from "../pages/events";

// Converts Google Drive share URLs to direct image URLs
function driveLinkToImage(url?: string): string | null {
  if (!url) return null;
  // Handles links like: https://drive.google.com/file/d/<ID>/view?usp=drivesdk
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  // Optionally handle ?id= links
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }
  return null;
}

interface Props {
  events: EventItem[];
}

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, idx) => {
        const images = [event.IMG_1, event.IMG_2, event.IMG_3]
          .map((link) => driveLinkToImage(link))
          .filter((src): src is string => !!src);

        return (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            {images.length > 0 && (
              <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                autoPlay
                interval={4000}
                swipeable
                emulateTouch
              >
                {images.map((src, i) => (
                  <div key={i} className="h-64 w-full bg-gray-100 flex items-center justify-center">
                    <img
                      src={src}
                      alt={`Event ${event.TITLE} image ${i + 1}`}
                      className="w-full h-64 object-cover"
                      style={{ objectFit: "cover", maxHeight: "16rem", width: "100%" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            )}

            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">{event.TITLE}</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {typeof event.DESCRIPTION === "string" && event.DESCRIPTION.trim() ? event.DESCRIPTION.trim() : "No description"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
