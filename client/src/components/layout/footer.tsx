import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-dav-maroon text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                className="h-12 w-12 rounded-full" 
                src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                alt="DAV Public School Logo" 
              />
              <div className="ml-4">
                <h3 className="text-lg font-bold">DAV Public School</h3>
                <p className="text-sm text-gray-300">Asansol</p>
              </div>
            </div>
            <p className="text-gray-300">Excellence in Education since 1999. CBSE Affiliation No. 2430088</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about"><span className="hover:text-dav-saffron transition-colors cursor-pointer">About Us</span></Link></li>
              <li><Link href="/academics"><span className="hover:text-dav-saffron transition-colors cursor-pointer">Academics</span></Link></li>
              <li><Link href="/admissions"><span className="hover:text-dav-saffron transition-colors cursor-pointer">Admissions</span></Link></li>
              <li><Link href="/gallery"><span className="hover:text-dav-saffron transition-colors cursor-pointer">Gallery</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-dav-saffron transition-colors cursor-pointer">Contact</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Academics</h4>
            <ul className="space-y-2 text-gray-300">
              <li><span className="hover:text-dav-saffron transition-colors cursor-pointer">Primary Section</span></li>
              <li><span className="hover:text-dav-saffron transition-colors cursor-pointer">Middle Section</span></li>
              <li><span className="hover:text-dav-saffron transition-colors cursor-pointer">Senior Section</span></li>
              <li><span className="hover:text-dav-saffron transition-colors cursor-pointer">Curriculum</span></li>
              <li><span className="hover:text-dav-saffron transition-colors cursor-pointer">Facilities</span></li>
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
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 DAV Public School, Asansol. All rights reserved. | Designed with ❤️ for education</p>
        </div>
      </div>
    </footer>
  );
}
