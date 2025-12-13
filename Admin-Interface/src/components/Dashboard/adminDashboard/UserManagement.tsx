import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import UserList from "./UserList";
import RolesSelection from "./RolesSelection";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState<"all" | "admins" | "students">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/admin/getAll"
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Filtered users based on role
  const filteredUsers = users.filter((user: any) => {
  // 1️⃣ Button filter
  if (filter === "admins") {
    if (!["ss_admin", "lf_admin", "pat_admin", "it_admin"].includes(user.role)) {
      return ["ss_admin", "lf_admin", "pat_admin", "it_admin"].includes(user.role);
    }
  }

  if (filter === "students") {
    if (user.role !== "user") {
      return false;
    }
  }

  // 2️⃣ Role dropdown filter
  if (roleFilter !== "all") {
    return user.role === roleFilter;
  }

  const term = searchTerm.toLowerCase();
      if(
        !user.username.toLowerCase().includes(term) &&
        !user.email.toLowerCase().includes(term) &&
        !user.phone.includes(term)
      ){
        return false;
      }

  return ["ss_admin", "lf_admin", "pat_admin", "it_admin", "user"].includes(user.role);

});


  return (
    <>
      <div className="mx-10">
        <h1 className="font-bold text-xl">User Management</h1>
        <div className="flex flex-col gap-2 justify-center max-w-full h-130 max-h-130 border border-[var(--gray-border)] mt-3 p-2 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="w-100 h-12 border border-[var(--gray-border)] flex text-center justify-center items-center gap-2 p-1 rounded-xl">
              <button
                className={`switch_btn ${filter === "all" ? "bg-[var(--gray-border)] text-black font-bold" : "bg-white"}`}
                onClick={() => setFilter("all")}
              >
                All Users
              </button>
              <button
                className={`switch_btn ${filter === "admins" ? "bg-[var(--gray-border)] text-black font-bold" : "bg-white"}`}
                onClick={() => setFilter("admins")}
              >
                Admins
              </button>
              <button
                className={`switch_btn ${filter === "students" ? "bg-[var(--gray-border)] text-black font-bold" : "bg-white"}`}
                onClick={() => setFilter("students")}
              >
                Students
              </button>
            </div>

            <div className="flex gap-2 align-center justify-center">
              <div className="p-2 flex gap-4 items-center w-65 border border-[var(--gray-border)] rounded-xl">
                <MdOutlineSearch size={28} />
                <input
                type="text"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e)=> setSearchTerm(e.target.value)} 
                className="w-full text-sm outline-none"
                />
              </div>
              <div>
                <RolesSelection value={roleFilter} onChange={setRoleFilter} />
              </div>
            </div>
          </div>

          <div className="p-3 h-full border border-[var(--gray-border)] rounded-xl">
            {/* User List */}
            <UserList users={filteredUsers} />
          </div>
        </div>
      </div>
    </>
  );
}
