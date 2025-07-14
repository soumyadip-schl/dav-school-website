import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative">
      <div 
        className="h-96 md:h-[500px] bg-cover bg-center relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://raw.githubusercontent.com/soumyadip-schl/dav-school-website/a37e9d0da73b988bc57f2c7b904f1af1522e48c7/attached_assets/Message_a4213de2-8768-4736-bc67-9ce7edc51b2e_school-building2.jpg')"
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 fade-in">Excellence in Education</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto fade-in">
              Nurturing young minds for a brighter tomorrow at DAV Public School, Kanyapur, Asansol
            </p>
            <div className="space-x-4">
              <Link href="/admissions">
                <button className="bg-dav-saffron hover:bg-dav-orange text-white px-8 py-3 rounded-lg font-semibold transition-colors hover-lift">
                  Apply Now
                </button>
              </Link>
              <Link href="/gallery">
                <button className="border-2 border-white text-white hover:bg-white hover:text-dav-maroon px-8 py-3 rounded-lg font-semibold transition-colors hover-lift">
                  Virtual Tour
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
