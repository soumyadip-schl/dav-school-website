export default function PrincipalMessage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=600" 
              alt="Principal's photo" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-dav-maroon mb-6">Principal's Message</h2>
            <div className="text-lg text-gray-700 space-y-4">
              <p>
                Welcome to DAV Public School, Asansol! As we embark on another academic year, I am filled with excitement and optimism about the journey ahead.
              </p>
              <p>
                Our school stands as a beacon of educational excellence, committed to nurturing young minds and shaping tomorrow's leaders. With our dedicated faculty, state-of-the-art facilities, and comprehensive curriculum, we provide an environment where every student can thrive academically, socially, and personally.
              </p>
              <p>
                At DAV, we believe in the holistic development of our students, fostering not just academic excellence but also character building, creativity, and critical thinking skills that will serve them throughout their lives.
              </p>
            </div>
            <div className="mt-6">
              <p className="font-semibold text-dav-maroon">Dr. Priya Sharma</p>
              <p className="text-gray-600">Principal, DAV Public School, Asansol</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
