import React from "react";
import { NavLink } from "react-router-dom";
// استيراد الأيقونات من Heroicons
import {
  UserPlusIcon,
  UserMinusIcon,
  TagIcon,
  TrashIcon,
  MegaphoneIcon,
  BuildingLibraryIcon ,
  XCircleIcon,
 BanknotesIcon  ,
} from "@heroicons/react/24/outline";

function Menu() {
  const items = [
    { text: "إضافة حساب جديد", path: "/app/add-account", icon: UserPlusIcon },
    { text: "حذف حساب", path: "/app/delete-account", icon: UserMinusIcon },
    { text: "إضافة عرض جديد", path: "/app/add-offer", icon: TagIcon },
    { text: "حذف عرض", path: "/app/delete-offer", icon: TrashIcon },
    { text: "إضافة كوينز", path: "/app/add-coins", icon: BanknotesIcon  },
    { text: "إضافة نقابه", path: "/app/add-union", icon: BuildingLibraryIcon  },
    { text: "حذف نقابه", path: "/app/delete-union", icon: XCircleIcon },
    { text: " اضافه اعلان", path: "/app/uploadad", icon: MegaphoneIcon },
  ];

  return (
    <ul className="menu bg-[#005FA1] text-white rounded-2xl w-72 ml-auto mr-5 mt-10 p-2 shadow-lg text-right space-y-3">
      {items.map((item, i) => (
        <li key={i}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex flex-row-reverse items-center gap-3 p-2 rounded-lg transition-all duration-200 
              ${
                isActive
                  ? "bg-white text-[#005FA1] font-bold shadow-md"
                  : "hover:bg-[#1E6FB8] active:bg-[#004080] active:scale-95"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-9 h-9 rounded-full p-1.5 shadow-md transform transition-all duration-300
                    ${
                      isActive
                        ? "bg-[#005FA1] text-white scale-110 rotate-3"
                        : "bg-white text-[#005FA1] hover:scale-110 hover:rotate-6"
                    }`}
                />
                <span className="text-lg font-medium">{item.text}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Menu;
