export default function PrincipalMessage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Principal image with 16:9 aspect ratio, fully visible, no crop, all interaction blocked */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: "16 / 9",
            width: "100%",
            maxWidth: "100%",
            userSelect: "none"
          }}
        >
          <img
            src="https://raw.githubusercontent.com/soumyadip-schl/dav-school-website/405466596a6de55440ce4e8b95ce3ebcd083539e/attached_assets/principal_image(1).jpg"
            alt="Principal"
            className="rounded-xl shadow-lg w-full h-full object-contain pointer-events-none select-none"
            style={{
              aspectRatio: "16 / 9",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
              display: "block"
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
            aria-hidden="true"
          />
        </div>
        <div className="mt-8">
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
    </section>
  );
}
