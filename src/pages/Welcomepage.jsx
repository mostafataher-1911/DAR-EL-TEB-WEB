import React from 'react'
import CustomButtonicon from '../component/CustomButtonicon'
import doctorImg from '../assets/images/doctor.png'
import nurseImg from '../assets/images/nurse.png'
import logoimg from '../assets/images/logo (15).png'
import reactangle1 from '../assets/images/Rectangle 1.png'
import reactangle2 from '../assets/images/Rectangle 2.png'
import { Link } from 'react-router-dom'

function Welcomepage() {
  return (
    <>
      <div className="relative flex justify-center items-center min-h-screen 
                      bg-gradient-to-br from-base-200 to-base-100 transition-colors duration-300 overflow-hidden">

        <div className="absolute w-[400px] h-[400px] bg-[#005FA1]/10 rounded-full top-[-100px] left-[-100px] blur-2xl animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#005FA1]/10 rounded-full bottom-[-80px] right-[-80px] blur-2xl animate-pulse"></div>

        <div className="relative flex flex-col justify-center items-center border-1 border-[#005FA1] rounded-lg m-10 p-10 w-full max-w-md overflow-hidden bg-base-100/80 backdrop-blur-sm transition-colors duration-300">
          <img
            src={reactangle1}
            alt="top-left"
            className="absolute top-0 left-0 w-[250px] h-[120px] opacity-70"
          />

          <img
            src={reactangle2}
            alt="bottom-right"
            className="absolute bottom-0 right-0 w-[250px] h-[120px] opacity-70"
          />

          <div className="absolute top-4 right-4 bg-white rounded-full p-1">
            <img
              src={logoimg}
              alt="logoimg"
              className="w-[100px] h-[100px] object-contain"
            />
          </div>

          <h3 className="font-roboto font-bold text-[20px] text-center text-[#005FA1] dark:text-base-content mb-5 mt-28 transition-colors duration-300">
            اهلا بك في معمل دار الطب
          </h3>

          <hr className="border-t border-base-300 mb-10 w-[80%] mx-auto transition-colors duration-300" />

          <div className="flex flex-col  gap-4 justify-center items-center mb-25">
           
            <Link to="/login?role=doctor" >
              <CustomButtonicon
                icon={<img src={doctorImg} alt="doctor Icon" />}
                text="الطبيب"
                 className="focus:outline-none"
              />
            </Link>

            <Link to="/login?role=assistant">
              <CustomButtonicon
                icon={<img src={nurseImg} alt="nurse Icon" />}
                text="مساعد الطبيب"
                 className="bg-white"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Welcomepage