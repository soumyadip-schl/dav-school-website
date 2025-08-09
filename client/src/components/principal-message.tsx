export default function PrincipalMessage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Card-style container for consistent thickness with other sections */}
            <div
              className="bg-white rounded-xl shadow-lg p-0 mb-8" // <-- No extra padding added
              style={{
                aspectRatio: "4 / 3",
                width: "100%",
                maxWidth: "100%"
              }}
            >
              <div className="relative w-full h-full">
                <img
                  src="https://raw.githubusercontent.com/soumyadip-schl/dav-school-website/main/attached_assets/Picsart_25-07-15_19-33-26-605.jpg"
                  alt="Principal's photo"
                  className="rounded-xl w-full h-full object-cover select-none pointer-events-none"
                  style={{
                    aspectRatio: "4 / 3",
                    width: "100%",
                    height: "100%",
                  }}
                  draggable={false}
                  tabIndex={-1}
                  onContextMenu={e => e.preventDefault()}
                  onDragStart={e => e.preventDefault()}
                />
                {/* Overlay to block interactions */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    zIndex: 2,
                    background: "transparent",
                    pointerEvents: "auto",
                    userSelect: "none"
                  }}
                  onContextMenu={e => e.preventDefault()}
                  onMouseDown={e => e.preventDefault()}
                  onDragStart={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-dav-maroon mb-6">Principal's Message</h2>
            <div className="text-lg text-gray-700 space-y-4">
              <p>
                Aristotle once said that “educating the mind without educating the heart is no education at all”. Even as we impart education to match the advancement in technology and globalization, we ensure our students develop strong values and a caring attitude.
              </p>
              <p>
                Our goal at DAV is to provide enriching, engaging, and challenging curriculum that will prepare students for success while at DAV and in the years to follow. We believe that students, parents, and teachers are partners in the learning process.
              </p>
              <p>
                A committed and supportive management, dedicated teachers, and caring, cooperative parents blend harmoniously to create a child–centric school.
              </p>
              <p>
                I am sure through collaborative effort we can provide more benefit to our students who are the future leaders of tomorrow.
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
