import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Menu from "./Menu";

function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ثابت Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* ثابت Menu */}
        <div className="w-[200px] bg-gray-100 border-r border-gray-300 overflow-y-auto">
          <Menu />
        </div>

        {/* الجزء المتغير */}
        <div className="flex-1 flex items-center justify-center bg-white relative overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
