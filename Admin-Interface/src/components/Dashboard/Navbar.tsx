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
        <div className="flex justify-between items-center px-6 py-4">
          
          {/* Left Side: Branding & Role */}
          <div className="flex gap-4 items-center">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl border border-blue-100 shadow-sm">
              <MdOutlineShield size={32} />
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-gray-900 tracking-tight text-lg capitalize">
                {getRoleText()}
              </div>
              <div className="text-gray-500 text-sm font-medium capitalize flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {user.username || "System Admin"}
              </div>
            </div>
          </div>

          {/* Right Side: User Info & Logout */}
          <div className="flex justify-between items-center gap-8">
            <div className="flex flex-col items-end hidden sm:flex">
              <div className="font-bold text-gray-900 tracking-tight">IslingConnect</div>
              <div className="text-sm text-gray-500">{user.email || "admin@islingconnect.edu.np"}</div>
            </div>
            
            <button
              onClick={logout}
              className="flex gap-2 items-center border border-red-100 bg-red-50 text-red-600 rounded-lg px-4 py-2 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md transition-all duration-300 font-medium cursor-pointer"
            >
              <span>Logout</span>
              <LuLogOut size={18} />
            </button>
          </div>
          
        </div>
      </header>
    </>
  );
}
