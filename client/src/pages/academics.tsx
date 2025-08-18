import React from "react";

export default function Admissions() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dav-maroon mb-4">Admissions</h1>
          <p className="text-gray-600">Join our vibrant school community. Explore the admissions process and requirements below.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-dav-maroon mb-4">Admission Process</h2>
            <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
              <li>Obtain the application form from the school office or download it from our website.</li>
              <li>Fill out the form accurately with all required details.</li>
              <li>Submit the completed form along with necessary documents (birth certificate, previous mark sheets, etc.).</li>
              <li>Attend the interaction/entrance test as scheduled by the school.</li>
              <li>Wait for the list of selected candidates to be published on the notice board/website.</li>
              <li>Complete the admission formalities and pay the fees within the stipulated time.</li>
            </ol>
            
            <h2 className="text-2xl font-bold text-dav-maroon mb-4">Eligibility Criteria</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Nursery: Minimum age 3+ years as on 31st March of the admission year.</li>
              <li>Other Classes: Based on previous class performance and seat availability.</li>
              <li>Transfer Certificate required for admissions from Class 2 onwards.</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-dav-maroon mb-4">Documents Required</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Birth Certificate (original & copy)</li>
              <li>Last Report Card</li>
              <li>Transfer Certificate (if applicable)</li>
              <li>Recent Passport Size Photographs</li>
              <li>Address Proof</li>
            </ul>
          </div>
          
          <div>
            <div className="mb-8 relative">
              <img
                src="https://raw.githubusercontent.com/soumyadip-schl/assets-dav/b62f9c7c4d72068f93f42fdd99aef1cdbcbffbad/web-assets/admissions.jpg"
                alt="Admissions"
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
              <h3 className="text-xl font-bold text-dav-maroon mb-4">Important Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">Jan 10</p>
                  <p className="text-gray-600">Forms Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">Feb 15</p>
                  <p className="text-gray-600">Last Date of Submission</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">Mar 01</p>
                  <p className="text-gray-600">Entrance Test</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">Mar 20</p>
                  <p className="text-gray-600">Results Declared</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <button className="bg-dav-saffron hover:bg-dav-orange text-white px-8 py-3 rounded-lg font-semibold transition-colors hover-lift">
                <i className="fas fa-download mr-2"></i>
                Download Admission Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
