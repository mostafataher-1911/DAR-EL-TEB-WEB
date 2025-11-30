import React, { useState } from "react";
import CustomInputicon from "./CustomInputicon";
import CustomButton from "./CustomButton";
import CustomSelect from "./CustomSelect"; // ✅ لازم تعمل import

function AddOffer() {
  const [offerType, setOfferType] = useState("");
  const [offerName, setOfferName] = useState("");
  const [price, setPrice] = useState("");
 const [discount, setDiscount] = useState("");     // نسبة الخصم
const [finalPrice, setFinalPrice] = useState(""); // السعر بعد الخصم


  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col gap-6 w-[350px]">
        {/* العنوان */}
        <h1 className="text-2xl font-bold text-[#005FA1] text-right">
          : إضافة عرض
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

        {/* سعر التحليل */}
        <CustomInputicon
        
          type="number"
          placeholder="سعر التحليل"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
          }
          value={price}
          onChange={(e) => setPrice(e.target.value)} // ✅ ربط القيمة
        />
        <div className="flex justify-between items-center">
               {/* سعر بعد الخصم */}
        <div className="flex flex-col gap-2 w-[120px] max-w-sm mx-auto text-center">
          <label className="text-[#005FA1] font-medium">سعر بعد الخصم</label>
          <div className="relative">
            <input
              type="number"
              placeholder="----"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              className="w-full border-gray-300 border-1 rounded-lg py-2 pr-14 pl-3 outline-none text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              EGP
            </span>
          </div>
        </div>
    {/* {icons} */}
        <div className="mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-[#005FA1]">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>

        </div>
            {/* نسبة الخصم */}

        <div className="flex flex-col gap-2 w-[100px] max-w-sm mx-auto text-center">
          <label className="text-[#005FA1] font-medium"> نسبه الخصم</label>
          <div className="relative">
            <input
              type="number"
              placeholder="----"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border-1 border-gray-300 rounded-lg py-2 pr-14 pl-3 outline-none text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              %
            </span>
          </div>
        </div>
     
        </div>
        {/* الزرار */}
        <CustomButton
          text="إضافة عرض"
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

export default AddOffer;
