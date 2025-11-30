import React from "react";
import CustomInputicon from "./CustomInputicon";
import GenderSelector from "./GenderSelector";
import CustomButton from "./CustomButton";

function AddAcount() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col gap-6 w-[350px]">
        {/* العنوان */}
        <h1 className="text-2xl font-bold text-[#005FA1] text-right">
          : إضافة حساب جديد
        </h1>

        {/* اسم المستخدم */}
        <CustomInputicon
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          }
          placeholder="اسم المستخدم"
        />

        {/* النوع */}
        
        <GenderSelector />

        {/* رقم المحمول */}
        <CustomInputicon
        type="number"
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
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
          }
          placeholder="رقم المحمول"
        />

        {/* الزرار */}
        <CustomButton text="إضافة " onClick={() => {}} />
      </div>
    </div>
  );
}

export default AddAcount;
