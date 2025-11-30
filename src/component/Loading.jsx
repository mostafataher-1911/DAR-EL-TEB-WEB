import React from "react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <span className="loading loading-dots loading-lg text-[#005FA1]"></span>
      {/* 👆 اللون أزرق (غيره لأي Tailwind color) */}
    </div>
  );
}

export default Loading;
