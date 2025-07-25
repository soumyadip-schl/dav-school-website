import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Admissions", href: "/admissions" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                className="h-12 w-12 rounded-full" 
                src="https://raw.githubusercontent.com/soumyadip-schl/dav-school-website/e6c5abf3ca5713c3f9afe01822a5b49cb6b957a4/attached_assets/DAV_CMC_Logo.svg.png" 
                alt="DAV Public School Logo"  
              />
            </div>
            <div className="ml-4">
              <Link href="/">
                <h1 className="text-lg font-bold text-dav-maroon cursor-pointer">DAV Public School</h1>
                <p className="text-sm text-dav-gray">Asansol</p>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={cn(
                    "px-3 py-2 font-medium transition-colors cursor-pointer",
                    location === item.href 
                      ? "text-dav-maroon" 
                      : "text-gray-700 hover:text-dav-saffron"
                  )}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-700 hover:text-dav-saffron p-2" 
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              {/* Use an accessible menu icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span 
                  className={cn(
                    "block px-3 py-2 cursor-pointer rounded transition-colors",
                    location === item.href 
                      ? "text-dav-maroon font-medium bg-dav-light" 
                      : "text-gray-700 hover:text-dav-saffron"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
