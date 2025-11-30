import React, { useState } from "react";
import CustomInputicon from "./CustomInputicon";
import CustomButton from "./CustomButton";

function AddCoins() {
  const [mobile, setMobile] = useState("");
  const [coins, setCoins] = useState("");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col gap-6 w-[350px]">
        {/* العنوان */}
        <h1 className="text-2xl font-bold text-[#005FA1] text-right">
          : إضافة كوينز
        </h1>

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
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        {/* عدد الكوينز */}
        <div className="flex flex-col gap-2 w-[100px] max-w-sm mx-auto text-right">
          <label className="text-[#005FA1] font-medium">: عدد الكوينز</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={coins}
              onChange={(e) => setCoins(e.target.value)}
              className="w-full bg-gray-200 rounded-lg py-2 pr-14 pl-3 outline-none text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
              Coins
            </span>
          </div>
        </div>

        {/* الزرار */}
        <CustomButton
          text="إضافة كوينز"
          onClick={() => {
            console.log("Mobile:", mobile, "Coins:", coins);
          }}
        />
      </div>
    </div>
  );
}

export default AddCoins;
