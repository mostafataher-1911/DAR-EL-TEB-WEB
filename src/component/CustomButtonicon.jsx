import React from "react";

export default function CustomButtonicon({ icon, text  }) {
  return (
    <button
      className="
    w-[200px]   
    sm:w-[200px] 
    md:w-[280px] 
    lg:w-[353px] 
    h-[56px]
        flex items-center justify-between
        border-2 border-[#005FA1]
        rounded-[10px]
 px-4
         opacity-100
        cursor-pointer
        transition-all duration-300
        hover:bg-[#005FA1]/10
        hover:border-[#004080]
        active:scale-95
      "
    >
      {/* الأيقونة على الشمال */}
      <span className="flex-shrink-0 w-[24px] h-[24px]">{icon}</span>

      {/* النص على اليمين */}
      <span className="text-[#005FA1] font-roboto font-bold text-lg">
        {text}
      </span>
    </button>
  );
}
