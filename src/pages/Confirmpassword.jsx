import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInputicon from "../component/CustomInputicon";
import logoimg from "../assets/images/logo (15).png";
import reactangle1 from "../assets/images/Rectangle 1.png";
import reactangle2 from "../assets/images/Rectangle 2.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // 👈 استيراد الايقونات

function Confirmpassword() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const isDisabled = !(phone && password && newpassword);

  const handleLogin = () => {
    if (!isDisabled) {
      if (password !== newpassword) {
        setError("كلمة السر غير متطابقة");
        return;
      }
      setError("");
      console.log("Phone:", phone, "Password:", password);
      navigate("/app");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E6F0FA] to-white overflow-hidden">
      {/* دوائر شفافة */}
      <div className="absolute w-[400px] h-[400px] bg-[#005FA1]/10 rounded-full top-[-100px] left-[-100px] blur-2xl animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-[#005FA1]/10 rounded-full bottom-[-80px] right-[-80px] blur-2xl animate-pulse"></div>

      {/* الكارد */}
      <div className="relative flex flex-col justify-center items-center border-1 border-[#005FA1] rounded-lg m-10 p-10 w-full max-w-md overflow-hidden bg-white/80 backdrop-blur-sm">
        {/* الديكور */}
        <img src={reactangle1} alt="top-left" className="absolute top-0 left-0 w-[250px] h-[110px] opacity-70" />
        <img src={reactangle2} alt="bottom-right" className="absolute bottom-0 right-0 w-[250px] h-[100px] opacity-70 " />

        {/* اللوجو */}
        <div className="absolute top-4 right-4">
          <img src={logoimg} alt="logoimg" className="w-[100px] h-[100px] object-contain" />
        </div>

        {/* العنوان */}
        <h3 className="font-roboto font-bold text-[20px] text-center text-[#001D3C] mb-3 mt-20">
          اهلا بك في معمل دار الطب
        </h3>
        <hr className="border-t border-gray-300 mb-10 w-[80%] mx-auto" />

        {/* الحقول */}
        <div className="flex flex-col gap-4 justify-center items-center mb-4 w-full">
          <CustomInputicon
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            }
            placeholder="ادخل رقم الهاتف"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* كلمة السر الجديدة */}
        <CustomInputicon
  placeholder="ادخل كلمة السر الجديدة"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  icon={
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <EyeSlashIcon className="w-[24px] h-[24px] text-[#005FA1]" />
      ) : (
        <EyeIcon className="w-[24px] h-[24px] text-[#005FA1]" />
      )}
    </button>
  }
/>

<CustomInputicon
  placeholder="تأكيد كلمة السر الجديدة"
  type={showNewPassword ? "text" : "password"}
  value={newpassword}
  onChange={(e) => setNewpassword(e.target.value)}
  icon={
    <button
      type="button"
      onClick={() => setShowNewPassword(!showNewPassword)}
    >
      {showNewPassword ? (
        <EyeSlashIcon className="w-[24px] h-[24px] text-[#005FA1]" />
      ) : (
        <EyeIcon className="w-[24px] h-[24px] text-[#005FA1]" />
      )}
    </button>
  }
/>

          {/* رسالة خطأ */}
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>

        {/* زر تسجيل الدخول */}
        <button
          disabled={isDisabled}
          onClick={handleLogin}
          className={`mb-10 w-[180px] sm:w-[180px] md:w-[250px] lg:w-[320px] z-50
            h-[50px] rounded-[10px] font-bold text-lg text-white transition-all
            ${isDisabled ? "bg-[#09BCDB80] cursor-not-allowed" : "bg-[#09BCDB] hover:bg-[#08A5C5] cursor-pointer"}`}
        >
          متابعة
        </button>
      </div>
    </div>
  );
}

export default Confirmpassword;
