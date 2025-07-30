export default function PrincipalMessage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://raw.githubusercontent.com/soumyadip-schl/dav-school-website/main/attached_assets/Picsart_25-07-15_19-33-26-605.jpg" 
              alt="Principal's photo" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-dav-maroon mb-6">Principal's Message</h2>
            <div className="text-lg text-gray-700 space-y-4">
              <p>
                Aristotle once said that “educating the mind without educating the heart is no education at all”. Even as we impart education to match the advancement in technology and globalization, we march our children ahead with the DAV ethos of moral values and principles. Our goal is to provide a time for students to build connections with teachers and peers and to build a stronger sense of community. We believe in the adage “Every day brings new choices, choose to make a positive difference “
              </p>
                <p>
                Our goal at DAV is to provide enriching, engaging and challenging curriculum that will prepare STUDENTS FOR SUCCESS while at DAV and the years to follow. We believe that students, parents and teachers play a vital role in helping students to reach their greatest potential.
             </p>
                  <p>
                A committed and supportive management dedicated teachers, caring and cooperative parents blend harmoniously to create a child –centric school.
           </p>
              <p>
                I am sure through collaborative effort we can provide more benefit to our  students who are the future leaders of tomorrow.
                  </p>
              </div>
            <div className="mt-6">
              <p className="font-semibold text-dav-maroon">Mr. D.R. Mahanty</p>
              <p className="text-gray-600">Principal, DAV Public School, Kanyapur, Asansol</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
