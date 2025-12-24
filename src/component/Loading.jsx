import React from "react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-100 transition-colors duration-300">
      <span className="loading loading-dots loading-lg text-[#005FA1]"></span>
    </div>
  );
}

export default Loading;