import React from 'react'
import CustomSelect from './CustomSelect';
import CustomButton from './CustomButton';

function DeleteUnion() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="flex flex-col gap-6 w-[350px]">
            {/* العنوان */}
            <h1 className="text-2xl font-bold text-[#005FA1] text-right">
              : حذف نقابه
            </h1>
    
            {/* اسم النقابه */}
            <CustomSelect
              icon={
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
    
              }
              defaultValue=" اسم النقابه"
                options={["نقابه 1", "نقابه 2", "نقابه 3"]}
            />
    
    
            {/* الزرار */}
            <CustomButton
            color={"#FF0000"} 
              text="حذف نقابه"
              onClick={() => {
                console.log("Union:", union);
              }}
            />
            
          </div>
        </div>
  )
}

export default DeleteUnion