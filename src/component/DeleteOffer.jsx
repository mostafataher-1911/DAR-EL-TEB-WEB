
import React, { useState } from "react";

import CustomButton from "./CustomButton";
import CustomSelect from "./CustomSelect"; // ✅ لازم تعمل import

function DeleteOffer() {
  const [offerType, setOfferType] = useState("");
  const [offerName, setOfferName] = useState("");




  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col gap-6 w-[350px]">
        {/* العنوان */}
        <h1 className="text-2xl font-bold text-[#005FA1] text-right">
          : حذف عرض
        </h1>

        {/* نوع التحليل */}
        <CustomSelect
          icon={
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
</svg>

          }
          defaultValue=" إختر نوع التحليل "
          options={["نوع 1", "نوع 2", "نوع 3"]}
          onChange={(e) => setOfferType(e.target.value)} // ✅ ربط القيمة
        />

        {/* اسم التحليل */}
        <CustomSelect
          icon={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
</svg>

          }
          defaultValue=" إختر اسم التحليل "
          options={["اسم 1", "اسم 2", "اسم 3"]}
          onChange={(e) => setOfferName(e.target.value)} // ✅ ربط القيمة
        />

   
        {/* الزرار */}
        <CustomButton
        color={"#FF0000"} 
          text=" حذف عرض"
          onClick={() => {
            console.log("نوع التحليل:", offerType);
            console.log("اسم التحليل:", offerName);
            console.log("السعر:", price);
          }}
        />
      </div>
    </div>
  );
}



export default DeleteOffer