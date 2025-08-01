import React from "react";
import type { EventItem } from "../pages/events";

interface Props {
  events: EventItem[];
}

const EventsList: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, idx) => {
        const images = [event.IMG_1, event.IMG_2, event.IMG_3].filter(Boolean);

        return (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            {images.length > 0 ? (
              <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
                <img
                  src={images[0]}
                  alt={`Event ${event.TITLE} image 1`}
                  className="w-full h-64 object-cover"
                  style={{ objectFit: "cover", maxHeight: "16rem", width: "100%" }}
                />
              </div>
            ) : (
              <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span>No image available</span>
              </div>
            )}
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">{event.TITLE}</h3>
              <p className="text-gray-700 whitespace-pre-line">
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
