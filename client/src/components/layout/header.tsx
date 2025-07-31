import React from "react";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-dav-maroon text-white shadow">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <span className="font-bold text-lg cursor-pointer">
              DAV Public School, Kanyapur, Asansol
            </span>
          </Link>
        </div>
        <ul className="flex items-center space-x-6">
          <li>
            <Link href="/">
              <span className="hover:underline cursor-pointer">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <span className="hover:underline cursor-pointer">About</span>
            </Link>
          </li>
          <li>
            <Link href="/news">
              <span className="hover:underline cursor-pointer">News</span>
            </Link>
          </li>
          <li>
            <Link href="/events">
              <span className="hover:underline cursor-pointer">Events</span>
            </Link>
          </li>
          <li>
            <Link href="/gallery">
              <span className="hover:underline cursor-pointer">Gallery</span>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <span className="hover:underline cursor-pointer">Contact</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
