import { useState } from "react";

/**
 * Contact page that displays contact information, map, and Google Form instead of the custom contact form.
 */
export default function Contact() {
  return (
    <div className="py-16 bg-dav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-dav-maroon mb-4">Contact Us</h1>
          <p className="text-gray-600">Get in touch with us for any queries or information</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-dav-maroon mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-dav-saffron text-white p-3 rounded-full mr-4">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">
                      DAV Public School, Kanyapur, Asansol<br />
                      Opposite to District Magistrate Office,<br />
                      Lions Club Road,<br />
                      PO- R.K Mission, PS-Asansol (N)<br />
                      DT : Paschim Bardhaman , PIN : 713305<br />
                      City : Asansol, State : West Bengal 
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-dav-saffron text-white p-3 rounded-full mr-4">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">
                      03412257755<br />
                      03412999244
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-dav-saffron text-white p-3 rounded-full mr-4">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">
                      dav.asnl@gmail.com<br />
                      schl.soumyadipkarforma@gmail.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-dav-saffron text-white p-3 rounded-full mr-4">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 2:00 PM<br />
                      Saturday: 8:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-dav-saffron hover:text-dav-maroon text-2xl">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="text-dav-saffron hover:text-dav-maroon text-2xl">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-dav-saffron hover:text-dav-maroon text-2xl">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-dav-saffron hover:text-dav-maroon text-2xl">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-dav-maroon mb-6">Send us a Message</h2>
              {/* Google Form Embed with dynamic width/height and matching UI */}
              <div
                className="w-full"
                style={{
                  minHeight: "500px",
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <iframe
                  title="Contact Google Form"
                  src="https://docs.google.com/forms/d/e/1FAIpQLScFZS6zocOjFiLEcw88AIWG_aDJFBvIbDtSdR-Rw1Fj0Qzf3Q/viewform?embedded=true"
                  style={{
                    width: "100%",
                    minHeight: "900px",
                    border: "none",
                    borderRadius: "0.75rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    background: "transparent",
                  }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-dav-maroon mb-4">Our Location</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              <iframe
                title="DAV Public School, Kanyapur, Asansol Location"
                src="https://www.google.com/maps?q=DAV+Public+School,+Kanyapur,+Beside+District+Magistrate+Office,+Lions+Club+Road,+R.K+Mission,+Asansol,+West+Bengal+713305&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '0.75rem' }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                  }
