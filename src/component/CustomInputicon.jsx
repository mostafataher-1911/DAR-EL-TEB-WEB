import React from "react";

export default function CustomInputicon({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        w-full                 /* ياخد المساحة كلها في الفون */
        h-[56px]
        flex items-center
        border-2 border-[#005FA1]
        rounded-[10px]
        px-4
        opacity-100
        transition-all duration-300
        focus-within:border-[#004080]
        focus-within:shadow-md
        bg-white
        ${className}
      `}
    >
      {/* الأيقونة على الشمال */}
      <span className="flex-shrink-0 w-[24px] h-[24px] text-[#005FA1]">
        {icon}
      </span>

      {/* input */}
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="
          flex-1 mr-4 font-roboto 
          text-base text-[15px] sm:text-[15px] md:text-[17px] lg:text-[17px]
          outline-none bg-transparent 
          text-right
          placeholder:text-[#005FA1]/50 placeholder:opacity-100
          appearance-none
          w-full
        "
        {...props}
      />
    </div>
  );
}