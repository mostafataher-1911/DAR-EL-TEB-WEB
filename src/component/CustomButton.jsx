import React from "react";

export default function CustomButton({ text, onClick, color = "#005FA1" }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="
        w-full                /* يخلي الزرار ياخد عرض الكونتينر */
        max-w-[350px]         /* أقصى عرض للزرار */
        h-[48px]              /* ارتفاع مناسب للموبايل */
        sm:h-[52px]           /* تكبير بسيط للشاشات المتوسطة */
        md:h-[56px]           /* أكبر شوية للـ Desktop */
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
