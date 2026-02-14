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
        return "Sudent Services Admin";
      case "it_admin":
        return "IT Deaprtment Admin";
      case "pat_admin":
        return "PAT Department Admin";
      case "lf_admin":
        return "Lost and Found Admin";
      default:
        return "Invalid Role";
    }
  };

  return (
    <>
      <header className="border-b border-b-[var(--gray-border)]">
        <div className="flex justify-between p-4">
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--primary)] p-1 rounded-lg">
              <MdOutlineShield size={38} color="white" />
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-xl capitalize">
                {getRoleText()}
              </div>
              <div className="text-[var(--ia-text)] text-sm font-light] capitalize">
                {user.username}
              </div>
            </div>
          </div>

          <div className="flex justift-between items-center gap-10">
            <div className="flex flex-col items-start">
              <div className="font-bold">IslingConnect</div>
              <div className="text-sm">{user.email}</div>
            </div>
            <div
              className="flex gap-2 items-center border border-[var(--gray-border)] bg-[var(--gray-bg)] rounded-lg px-4 py-2 hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={logout}
            >
              <div>Logout</div>
              <div>
                <LuLogOut />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
