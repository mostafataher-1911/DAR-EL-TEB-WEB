import React from "react";
import Menu from "../layout/Menu";
import logoimg from "../assets/images/logo (15).png";
import AddAcount from "../component/AddAcount";
import DeleteAcount from "../component/DeleteAcount";
import AddCoins from "../component/AddCoins";
import AddUnion from "../component/AddUnion";
import DeleteUnion from "../component/DeleteUnion";
import AddOffer from "../component/AddOffer";
import DeleteOffer from "../component/DeleteOffer";
import Navbar from "../layout/Navbar";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <div className=" overflow-hidden bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main content with menu + center content */}
      <div className="  bg-white">
        {/* Center content */}
        <div className="relative flex items-center  justify-center bg-gray-50">
          {/* Background logo */}
          <img
            src={logoimg}
            alt="logo"
            className="absolute w-[403px] h-[415px] opacity-3 pointer-events-none select-none"
          />
              <div className="w-[100%]">
             <Outlet  />
             </div>
        </div>

        {/* Menu على اليمين
        <div className="flex-1 w-[200px]  border-l border-gray-300  bg-gray-50">
          <Menu />
        </div> */}
      </div>
    </div>
  );
}

export default Home;
