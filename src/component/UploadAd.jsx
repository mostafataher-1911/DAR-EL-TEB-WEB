import { useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import CustomButton from "./CustomButton";

function UploadAd() {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col gap-6 w-[400px]">
          {/* العنوان */}
          <h1 className="text-2xl font-bold text-[#005FA1] text-right">
            : إضافة إعلان
          </h1>

          {/* رفع صورة */}
          {!image ? (
            <label className="flex items-center justify-center w-16 h-16 bg-[#005FA1] text-white rounded-full shadow cursor-pointer hover:bg-[#004577] transition mx-auto">
              <PhotoIcon className="w-8 h-8" />
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={image}
                alt="preview"
                className="w-full h-full object-cover rounded-lg shadow"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* اختيار التاريخ (بداية ونهاية) جنب بعض */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col text-center w-1/2">
              <label className="mb-1 text-medium font-medium text-[#005FA1]">
                تاريخ النهاية
              </label>
              <input
                type="date"
                className="rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#005FA1] focus:outline-none text-sm w-full"
              />
            </div>

            <div className="flex flex-col text-center w-1/2">
              <label className="mb-1 text-medium font-medium text-[#005FA1]">
                تاريخ البداية
              </label>
              <input
                type="date"
                className="rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#005FA1] focus:outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* الزرار */}
          <CustomButton
            text="إضافة إعلان"
            onClick={() => {
              console.log("تم رفع الإعلان!");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UploadAd;
