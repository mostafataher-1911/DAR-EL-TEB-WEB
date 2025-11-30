import React, { useState } from "react";
import CustomInputicon from "./CustomInputicon";
import CustomButton from "./CustomButton";

function AddUnion(){
  const [union, setUnion] = useState("");
   const [discount, setDiscount] = useState("");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col gap-6 w-[350px]">
        {/* العنوان */}
        <h1 className="text-2xl font-bold text-[#005FA1] text-right">
          : إضافة نقابه
        </h1>

        {/* اسم النقابه */}
        <CustomInputicon
          icon={
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
</svg>

          }
          placeholder=" اسم النقابه"
          value={union}
          onChange={(e) => setUnion(e.target.value)}
        />

       
        {/*  نسبه الخصم للنقابه */}
        <div className="flex flex-col gap-2 w-[127px] text-center max-w-sm mx-auto ">
          <label className="text-[#005FA1] font-medium"> نسبه الخصم
للنقابه </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full bg-gray-200 rounded-lg py-2 pr-14 pl-3 outline-none text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              %
            </span>
          </div>
        </div>


        {/* الزرار */}
        <CustomButton
          text="إضافة نقابه"
          onClick={() => {
            console.log("Union:", union);
          }}
        />
      </div>
    </div>
  );
}
export default AddUnion