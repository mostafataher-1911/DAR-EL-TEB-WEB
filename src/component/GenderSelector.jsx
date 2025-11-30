import React, { useState } from "react";

export default function GenderSelector({ onChange }) {
  const [gender, setGender] = useState("");

  const handleChange = (value) => {
    setGender(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex gap-4 justify-center ">
         {/* أنثى */}
      <label className="cursor-pointer">
        <input
          type="radio"
          name="gender"
          value="انثي"
          checked={gender === "انثي"}
          onChange={() => handleChange("انثي")}
          className="hidden peer"
        />
        <div
          className="
            w-[120px] h-[45px]
            flex items-center justify-center
            border-2 border-[#005FA1] rounded-[10px]
            text-[#005FA1] font-semibold
            peer-checked:bg-[#005FA1] peer-checked:text-white
            transition-all duration-300
          "
        >
          أنثى
        </div>
      </label>
      {/* ذكر */}
      <label className="cursor-pointer">
        <input
          type="radio"
          name="gender"
          value="ذكر"
          checked={gender === "ذكر"}
          onChange={() => handleChange("ذكر")}
          className="hidden peer"
        />
        <div
          className="
            w-[120px] h-[45px]
            flex items-center justify-center
            border-2 border-[#005FA1] rounded-[10px]
            text-[#005FA1] font-semibold
            peer-checked:bg-[#005FA1] peer-checked:text-white
            transition-all duration-300
          "
        >
          ذكر
        </div>
      </label>

     
    </div>
  );
}
