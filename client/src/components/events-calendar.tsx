import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/schema";

export default function EventsCalendar() {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-dav-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-dav-saffron"></div>
            <p className="mt-2 text-gray-600">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-dav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dav-maroon mb-4">Upcoming Events</h2>
          <p className="text-gray-600">Stay updated with our latest events and activities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-xl shadow-md hover-lift">
              <div className="flex items-center mb-4">
                <div className="bg-dav-saffron text-white p-3 rounded-full">
                  <i className={event.icon}></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{event.date}</p>
                  <h3 className="font-semibold text-dav-maroon">{event.title}</h3>
                </div>
              </div>
              <p className="text-gray-600">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
