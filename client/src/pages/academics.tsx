import { academicSections } from "@/lib/data";

export default function Academics() {
  return (
    <div className="py-16 bg-dav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dav-maroon mb-4">Academic Excellence</h1>
          <p className="text-gray-600">Comprehensive curriculum following CBSE guidelines</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {academicSections.map((section, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover-lift">
              <div className="text-dav-saffron text-4xl mb-4">
                <i className={section.icon}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              <p className="text-gray-600 mb-4">{section.description}</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {section.subjects.map((subject, subIndex) => (
                  <li key={subIndex}>• {subject}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-dav-saffron hover:bg-dav-orange text-white px-8 py-3 rounded-lg font-semibold transition-colors hover-lift">
            <i className="fas fa-download mr-2"></i>
            Download Curriculum Guide
          </button>
        </div>
      </div>
    </div>
  );
}
