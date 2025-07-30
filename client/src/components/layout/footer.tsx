import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dav-maroon text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                className="h-12 w-12 rounded-full" 
                src="https://raw.githubusercontent.com/soumyadip-schl/dav-school-website/e6c5abf3ca5713c3f9afe01822a5b49cb6b957a4/attached_assets/DAV_CMC_Logo.svg.png" 
                alt="DAV Public School Logo" 
              />
              <div className="ml-4">
                <h3 className="text-lg font-bold">DAV Public School</h3>
                <p className="text-sm text-gray-300">Kanyapur, Asansol</p>
              </div>
            </div>
            <p className="text-gray-300">
              Excellence in Education since 1999. CBSE Affiliation No. 2430088
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">External Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="https://davcmc.net.in"><span className="hover:text-dav-saffron transition-colors cursor-pointer">About DAV CMC</span></Link></li>
              <li><Link href="https://appsabha.org"><span className="hover:text-dav-saffron transition-colors cursor-pointer">Arya Samaj</span></Link></li>
              <li><Link href="https://davcmc.net.in/B46D2794-51B4-4B3A-95B8-46BB25875D74/CMS/Page/MESSAGE-OF-THE-PRESIDENT"><span className="hover:text-dav-saffron transition-colors cursor-pointer">President's Message</span></Link></li>
              <li><Link href="https://youtube.com/@davcmcvideos?feature=shared"><span className="hover:text-dav-saffron transition-colors cursor-pointer">DAV CMC Videos</span></Link></li>
              <li><Link href="https://www.facebook.com/davunited"><span className="hover:text-dav-saffron transition-colors cursor-pointer">Alumni</span></Link></li>
              <li><Link href="https://ihub.davcmc.net.in/"><span className="hover:text-dav-saffron transition-colors cursor-pointer">DAV CMC Intellectual Hub</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="text-gray-300 space-y-2">
              <p><i className="fas fa-map-marker-alt mr-2"></i>Sector 12, Asansol - 713301</p>
              <p><i className="fas fa-phone mr-2"></i>+91 341 234 5678</p>
              <p><i className="fas fa-envelope mr-2"></i>info@davpublicschoolasansol.edu.in</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-dav-saffron"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-gray-300 hover:text-dav-saffron"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-300 hover:text-dav-saffron"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-300 hover:text-dav-saffron"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        {/* This section is still inside the main footer container */}
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <div className="max-w-screen-xl mx-auto px-4">
            <p>
              &copy; 2025 DAV Public School, Kanyapur, Asansol. All rights reserved. | 
              Designed with 🧡🤍💚 by Soumyadip Karforma
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
