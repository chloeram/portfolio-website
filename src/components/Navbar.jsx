import React from "react";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-opacity-70 px-8 py-4 flex justify-between items-center z-50">
        {/* Name on the Left */}
        <div className="text-lg font-bold">Chloe Ramirez</div>
  
        {/* Navigation Links */}
        <div className="flex space-x-6">
          <a href="#portfolio" className="hover:underline">Portfolio</a>
          <a href="#resume" className="hover:underline">Resume</a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
      </nav> 
    );
}