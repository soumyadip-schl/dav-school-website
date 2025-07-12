export default function About() {
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
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"
              alt="School building"
              className="rounded-xl shadow-lg w-full h-auto mb-6"
            />
            
            <div className="bg-dav-light p-6 rounded-xl">
              <h3 className="text-xl font-bold text-dav-maroon mb-4">Quick Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">25+</p>
                  <p className="text-gray-600">Years of Excellence</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">1500+</p>
                  <p className="text-gray-600">Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">100+</p>
                  <p className="text-gray-600">Faculty Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-dav-saffron">100%</p>
                  <p className="text-gray-600">Board Results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
