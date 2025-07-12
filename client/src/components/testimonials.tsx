import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-dav-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-dav-saffron"></div>
            <p className="mt-2 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-dav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dav-maroon mb-4">What Our Community Says</h2>
          <p className="text-gray-600">Hear from parents, students, and alumni about their DAV experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-md hover-lift">
              <div className="flex items-center mb-4">
                <div className="text-dav-saffron text-2xl">
                  <i className="fas fa-quote-left"></i>
                </div>
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.message}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=FF9933&color=fff`} 
                  alt={`${testimonial.name} testimonial`} 
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <p className="font-semibold text-dav-maroon">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
