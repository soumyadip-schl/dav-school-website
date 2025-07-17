import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  // Add more links as needed
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Sync theme with localStorage and system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Prevent scroll when menu is open on mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <nav className="w-full max-w-screen bg-white dark:bg-black px-4 py-2 fixed top-0 left-0 z-50 shadow">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-lg text-black dark:text-white">DAV School</span>
        </a>
        {/* Desktop links */}
        <div className="hidden md:flex space-x-6 items-center">
          {NAV_LINKS.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-black dark:text-white hover:underline"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-2 py-1 rounded text-black dark:text-white border border-gray-300 dark:border-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
        {/* Hamburger */}
        <button
          className="md:hidden text-black dark:text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          &#9776;
        </button>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-black/70 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>
      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white dark:bg-black z-50 shadow-lg transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          <button
            className="self-end text-2xl text-black dark:text-white"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          {NAV_LINKS.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-black dark:text-white text-lg py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={toggleDarkMode}
            className="mt-4 px-2 py-1 rounded text-black dark:text-white border border-gray-300 dark:border-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </div>
    </nav>
  );
}
