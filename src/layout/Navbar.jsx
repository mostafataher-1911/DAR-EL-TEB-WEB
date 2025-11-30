import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  BeakerIcon,
  BuildingLibraryIcon,
  MegaphoneIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import logoimg from "../assets/images/logo (15).png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  const role = localStorage.getItem("role"); // ✅ جلب الدور

  const navLinks = role === "assistant"
    ? [
        { to: "Alllabtest", label: "جميع التحليل", icon: <BeakerIcon className="w-5 h-5" /> },
        { to: "users", label: "جميع العملاء", icon: <UsersIcon className="w-5 h-5" /> },
    
        
      ]
    : [
        { to: "labtests", label: "اضافة التحليل", icon: <BeakerIcon className="w-5 h-5" /> },
        { to: "unions", label: "اضافة نقابة", icon: <BuildingLibraryIcon className="w-5 h-5" /> },
        { to: "ads", label: "اضافة اعلان", icon: <MegaphoneIcon className="w-5 h-5" /> },
        { to: "users", label: "جميع العملاء", icon: <UsersIcon className="w-5 h-5" /> },
        { to: "notifications", label: "الإشعارات", icon: <BellIcon className="w-5 h-5" /> },
      ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="navbar bg-[#005FA1] text-white shadow-lg px-6 flex flex-row-reverse">
      {/* Right side links */}
      <div className="flex-none hidden md:flex">
        <ul className="menu menu-horizontal px-1 flex items-center gap-4">
          {navLinks.map((link, idx) => (
            <li key={idx}>
              <Link
                to={link.to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium shadow transition
                  ${isActive(link.to)
                    ? "bg-[#00457a] text-white"
                    : "bg-white text-[#005FA1] hover:bg-gray-100"}`}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 shadow transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XMarkIcon className="w-7 h-7 text-white" /> : <Bars3Icon className="w-7 h-7 text-white" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-[64px] right-0 w-60 bg-white text-[#005FA1] shadow-lg rounded-l-lg p-4 z-50 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition
                    ${isActive(link.to)
                      ? "bg-[#00457a] text-white"
                      : "hover:bg-gray-100 text-[#005FA1]"}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 transition"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Logo on the left */}
      <div className="flex-1 flex justify-start">
        <Link
          to="/app"
          className="bg-white rounded-full p-1.5 flex items-center justify-center shadow-md hover:scale-105 transition"
        >
          <img src={logoimg} alt="logo" className="w-[38px] h-[38px] object-contain" />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;