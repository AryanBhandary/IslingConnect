import { MdOutlineShield } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setEmail(parsedUser.email);
      setUsername(parsedUser.username);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <header className="border-b border-b-[var(--gray-border)]">
        <div className="flex justify-between p-4">
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--primary)] p-1 rounded-lg">
              <MdOutlineShield size={36} color="white" />
            </div>
            <div className="font-bold text-2xl capitalize">{username}</div>
          </div>

          <div className="flex justift-between items-center gap-10">
            <div className="flex flex-col items-start">
              <div className="font-bold">IslingConnect</div>
              <div className="text-sm">{email}</div>
            </div>
            <div className="flex gap-2 items-center border border-[var(--gray-border)] bg-[var(--gray-bg)] rounded-lg px-4 py-2 cursor-pointer"
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
