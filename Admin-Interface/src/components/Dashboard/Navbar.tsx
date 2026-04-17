import { MdOutlineShield } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { useState } from "react";

export default function NavBar() {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    let email = "";
    let role = "";
    let username = "";

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      email = parsedUser.email || "";
      role = parsedUser.role || "";
      username = parsedUser.username || "";
    }

    if (storedRole) {
      role = storedRole;
    }

    return { email, role, username };
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const getRoleText = () => {
    switch (user.role) {
      case "admin":
        return "Super Admin";
      case "ss_admin":
        return "Student Services Admin";
      case "it_admin":
        return "IT Department Admin";
      case "pat_admin":
        return "PAT Department Admin";
      case "lf_admin":
        return "Lost and Found Admin";
      default:
        return "Admin Portal";
    }
  };

  return (
    <>
      <header className="border-b border-b-[var(--gray-border)] bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center px-3 py-3 sm:px-6 sm:py-4">
          
          {/* Left Side: Branding & Role */}
          <div className="flex gap-2 sm:gap-4 items-center min-w-0">
            <div className="bg-blue-50 text-blue-600 p-2 sm:p-2.5 rounded-xl border border-blue-100 shadow-sm shrink-0">
              <MdOutlineShield size={24} className="sm:hidden" />
              <MdOutlineShield size={32} className="hidden sm:block" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="font-bold text-gray-900 tracking-tight text-sm sm:text-lg capitalize truncate">
                {getRoleText()}
              </div>
              <div className="text-gray-500 text-xs sm:text-sm font-medium capitalize flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                <span className="truncate">{user.username || "System Admin"}</span>
              </div>
            </div>
          </div>

          {/* Right Side: User Info & Logout */}
          <div className="flex items-center gap-3 sm:gap-8 shrink-0">
            <div className="hidden md:flex flex-col items-end">
              <div className="font-bold text-gray-900 tracking-tight">IslingConnect</div>
              <div className="text-sm text-gray-500">{user.email || "admin@islingconnect.edu.np"}</div>
            </div>
            
            <button
              onClick={logout}
              className="flex gap-2 items-center border border-red-100 bg-red-50 text-red-600 rounded-lg px-2.5 py-2 sm:px-4 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md transition-all duration-300 font-medium cursor-pointer"
            >
              <span className="hidden sm:inline">Logout</span>
              <LuLogOut size={18} />
            </button>
          </div>
          
        </div>
      </header>
    </>
  );
}
