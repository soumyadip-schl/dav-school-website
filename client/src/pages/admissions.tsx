import { admissionProcess, requiredDocuments } from "@/lib/data";
import { useButtonLinks } from "@/context/button-links-context";

export default function Admissions() {
  const { buttonLinks, loading } = useButtonLinks();

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dav-maroon mb-4">Admissions 2024-25</h1>
          <p className="text-gray-600">
            Join our school community and embark on an educational journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-dav-light p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-bold text-dav-maroon mb-6">
              Admission Process
            </h2>
            <div className="space-y-6">
              {admissionProcess.map((step) => (
                <div key={step.step} className="flex items-start">
                  <div className="bg-dav-saffron text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-dav-light p-6 rounded-xl">
              <h3 className="text-xl font-bold text-dav-maroon mb-4">
                Required Documents
              </h3>
              <ul className="text-gray-600 space-y-2">
                {requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-file-alt text-dav-saffron mr-2"></i>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            {loading || !buttonLinks ? (
              <button className="bg-dav-saffron text-white px-8 py-3 rounded-lg font-semibold opacity-70 cursor-not-allowed" disabled>
                <i className="fas fa-download mr-2"></i>
                Download Application Form
              </button>
            ) : (
              <a
                className="bg-dav-saffron hover:bg-dav-orange text-white px-8 py-3 rounded-lg font-semibold transition-colors hover-lift mr-4 inline-block"
                href={buttonLinks.admissionsApplicationForm.link}
                download
              >
                <i className="fas fa-download mr-2"></i>
                {buttonLinks.admissionsApplicationForm.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
