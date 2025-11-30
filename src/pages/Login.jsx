import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomInputicon from "../component/CustomInputicon";
import logoimg from "../assets/images/logo (15).png";
import reactangle1 from "../assets/images/Rectangle 1.png";
import reactangle2 from "../assets/images/Rectangle 2.png";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(""); // doctor or assistant
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get("role");
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location.search]);

  const isDisabled = !(phoneOrEmail && password);

  const handleLogin = async () => {
    // ✅ التحقق من صحة البريد أو الهاتف
    // if (role === "doctor" && !phoneOrEmail.includes("@")) {
    //   setEmailError("يرجى إدخال بريد إلكتروني صالح يحتوي على @");
    //   toast.error("يرجى إدخال بريد إلكتروني صالح يحتوي على @");
    //   return;
    // }
    // if (role === "assistant" && phoneOrEmail.length < 8) {
    //   setEmailError("يرجى إدخال رقم هاتف صالح مكون من 8 أرقام على الأقل");
    //   toast.error("يرجى إدخال رقم هاتف صالح مكون من 8 أرقام على الأقل");
    //   return;
    // }

    setEmailError("");
    if (isDisabled) return;

    setLoading(true);

    try {
      const url =
        role === "doctor"
          ? "https://apilab.runasp.net/api/User/login/Admin"
          : "https://apilab.runasp.net/api/User/login/Assistant";

      const body =
        role === "doctor"
          ? { email: phoneOrEmail, password }
          : { phone: phoneOrEmail, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
           throw new Error( "بيانات الدخول غير صحيحة.");

      }

      // ✅ تسجيل الدخول ناجح
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(data.resource));

      // toast.success("تم تسجيل الدخول بنجاح!");
      setTimeout(() => navigate("/app"), 1500);
    } catch (err) {
      toast.error(err.message || " خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E6F0FA] to-white overflow-hidden">
      {/* 🔔 Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* دوائر شفافة */}
      <div className="absolute w-[400px] h-[400px] bg-[#005FA1]/10 rounded-full top-[-100px] left-[-100px] blur-2xl animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-[#005FA1]/10 rounded-full bottom-[-80px] right-[-80px] blur-2xl animate-pulse"></div>

      {/* كارد تسجيل الدخول */}
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
          {role === "doctor"
            ? "تسجيل دخول الطبيب"
            : role === "assistant"
            ? "تسجيل دخول مساعد الطبيب"
            : "اهلا بك في معمل دار الطب"}
        </h3>
        <p className="font-roboto text-[16px] text-center text-gray-500 mb-3">
          من فضلك قم بتسجيل الدخول
        </p>
        <hr className="border-t border-gray-300 mb-10 w-[80%] mx-auto" />

        {/* الحقول */}
        <div className="flex flex-col gap-2 justify-center items-center mb-4 w-full">
          {/* Email أو رقم الهاتف */}
          <CustomInputicon
            icon={
              role === "doctor" ? (
                <UserIcon className="w-6 h-6 text-[#005FA1]" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#005FA1]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25
                      a2.25 2.25 0 0 0 2.25-2.25v-1.372
                      c0-.516-.351-.966-.852-1.091l-4.423-1.106
                      c-.44-.11-.902.055-1.173.417l-.97 1.293
                      c-.282.376-.769.542-1.21.38
                      a12.035 12.035 0 0 1-7.143-7.143
                      c-.162-.441.004-.928.38-1.21l1.293-.97
                      c.363-.271.527-.734.417-1.173L6.963 3.102
                      a1.125 1.125 0 0 0-1.091-.852H4.5
                      A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              )
            }
            placeholder={
              role === "doctor"
                ? "ادخل البريد الإلكتروني"
                : "ادخل رقم الهاتف"
            }
            type={role === "doctor" ? "email" : "number"}
            value={phoneOrEmail}
            onChange={(e) => {
              setPhoneOrEmail(e.target.value);
              setEmailError("");
            }}
          />

          {/* كلمة السر */}
          <CustomInputicon
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
            placeholder="ادخل كلمة السر"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* تذكرني + نسيت كلمة السر */}
        {/* <div className="flex items-center justify-between w-full px-2 mb-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="checkbox checkbox-sm checkbox-info"
            />
            <span className="text-gray-600">تذكرني</span>
          </label>
          <Link
            to={"/confirmpassword"}
            className="text-[#005FA1] hover:underline"
          >
            نسيت كلمة السر؟
          </Link>
        </div> */}

        {/* زر تسجيل الدخول */}
        <button
          disabled={isDisabled || loading}
          onClick={handleLogin}
          className={`mb-10 w-[180px] sm:w-[180px] md:w-[250px] lg:w-[320px] z-50
            h-[50px] rounded-[10px] font-bold text-lg text-white transition-all
            ${
              isDisabled || loading
                ? "bg-[#09BCDB80] cursor-not-allowed"
                : "bg-[#09BCDB] hover:bg-[#08A5C5] cursor-pointer"
            }`}
        >
          {loading ? "جاري تسجيل الدخول..." : "متابعة"}
        </button>
      </div>
    </div>
  );
}

export default Login;
