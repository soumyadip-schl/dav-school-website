import PrincipalMessage from "../components/principal-message";
import { useButtonLinks } from "@/context/button-links-context";

export default function About() {
  const { buttonLinks, loading } = useButtonLinks();

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dav-maroon mb-4">About DAV Public School</h1>
          <p className="text-gray-600">CBSE Affiliation No. 2430088</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-dav-maroon mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              To provide quality education that nurtures intellectual growth, character development, and social responsibility while preparing students for global citizenship.
            </p>
            
            <h2 className="text-2xl font-bold text-dav-maroon mb-4">Our Vision</h2>
            <p className="text-gray-700 mb-6">
              To be a premier educational institution that empowers students to excel academically, socially, and morally, contributing positively to society.
            </p>
            
            <h2 className="text-2xl font-bold text-dav-maroon mb-4">Core Values</h2>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-center">
                <i className="fas fa-check text-dav-saffron mr-2"></i>
                Academic Excellence
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-dav-saffron mr-2"></i>
                Character Development
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-dav-saffron mr-2"></i>
                Innovation and Creativity
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-dav-saffron mr-2"></i>
                Social Responsibility
              </li>
            </ul>
          </div>
          
          <div>
            <div className="mb-8">
              <div className="relative" style={{ width: "100%" }}>
                <div
                  className="absolute inset-0 z-10 rounded-xl"
                  style={{
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
                <PrincipalMessage />
              </div>
            </div>
            <div className="relative mb-6">
              <img
                src="https://raw.githubusercontent.com/soumyadip-schl/assets-dav/b62f9c7c4d72068f93f42fdd99aef1cdbcbffbad/web-assets/schl-building.jpg"
                alt="School building"
                className="rounded-xl shadow-lg w-full h-auto"
                draggable={false}
                tabIndex={-1}
                style={{
                  pointerEvents: "none",
                  userSelect: "none"
                }}
                onContextMenu={e => e.preventDefault()}
                onDragStart={e => e.preventDefault()}
              />
              <div
                className="absolute inset-0 rounded-xl"
                style={{
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
            
            <div className="bg-dav-light p-6 rounded-xl">
              <h3 className="text-xl font-bold text-dav-maroon mb-4">Quick Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">3 acres</p>
                  <p className="text-gray-600">Campus Area</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">2</p>
                  <p className="text-gray-600">Computer Labs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">Top Notch</p>
                  <p className="text-gray-600">Faculty</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">Excellence</p>
                  <p className="text-gray-600">in Sports</p>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              {loading || !buttonLinks ? (
                <button className="bg-dav-saffron text-white px-8 py-3 rounded-lg font-semibold opacity-70 cursor-not-allowed" disabled>
                  <i className="fas fa-download mr-2"></i>
                  Download Public Info
                </button>
              ) : (
                <a
                  className="bg-dav-saffron hover:bg-dav-orange text-white px-8 py-3 rounded-lg font-semibold transition-colors hover-lift"
                  href={buttonLinks.aboutPublicInfo.link}
                  download
                >
                  <i className="fas fa-download mr-2"></i>
                  {buttonLinks.aboutPublicInfo.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
              }
