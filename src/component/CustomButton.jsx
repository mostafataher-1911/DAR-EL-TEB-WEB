import React from "react";

export default function CustomButton({ text, onClick, color = "#005FA1" }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="
        w-full                
        max-w-[350px]      
        h-[48px]            
        sm:h-[52px]           
        md:h-[56px]         
        text-white text-base sm:text-lg font-semibold
        rounded-[10px] 
        flex items-center justify-center
        transition-all duration-300
        cursor-pointer
        hover:brightness-90
      "
    >
      {text}
    </button>
  );
}
