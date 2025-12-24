import React, { useState, useEffect } from "react";
import logoimg from "../assets/images/logo (15).png";
import Navbar from "../layout/Navbar";
import { Outlet } from "react-router-dom";

function Home() {
  // Dark Mode State - نفس اللي في Dashboard و Addads
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggle Dark Mode - نفس اللي في Dashboard
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar مع تمرير toggleDarkMode */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main content with menu + center content */}
      <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Center content */}
        <div className="relative flex items-center justify-center bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
          {/* Background logo */}
          <img
            src={logoimg}
            alt="logo"
            className={`absolute w-[403px] h-[415px] pointer-events-none select-none transition-opacity duration-200 ${
              darkMode ? "opacity-5" : "opacity-3"
            }`}
          />
          <div className="w-[100%]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;