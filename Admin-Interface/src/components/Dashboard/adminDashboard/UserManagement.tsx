import { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import UserList from "./UserList";
import RolesSelection from "./RolesSelection";
import api from "../../../constants/axios";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<"all" | "admins" | "students">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/admin/getAll");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Change role
  const handleChangeRole = async (id: string, role: string) => {
    await api.put(`/api/admin/users/${id}/role`, { role });
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, role } : u))
    );
  };


  // Filtered users based on role
  const filteredUsers = users
    .filter((user: User) => {
      if (filter === "admins") {
        if (
          !["ss_admin", "lf_admin", "pat_admin", "it_admin"].includes(user.role)
        ) {
          return false;
        }
      }

      if (filter === "students") {
        if (user.role !== "user") {
          return false;
        }
      }

      if (roleFilter !== "all") {
        return user.role === roleFilter;
      }

      const term = searchTerm.toLowerCase();
      if (
        !user.username.toLowerCase().includes(term) &&
        !user.email.toLowerCase().includes(term) &&
        !user.phone.includes(term)
      ) {
        return false;
      }

      return ["ss_admin", "lf_admin", "pat_admin", "it_admin", "user"].includes(
        user.role
      );
    })
    .slice()
    .sort(
      (a: User, b: User) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="mx-10 my-5">
      <h1 className="font-bold text-xl">User Management</h1>

      <div className="flex flex-col gap-2 justify-center max-w-full h-130 max-h-130 border border-[var(--gray-border)] mt-3 p-2 rounded-xl">
        {/* 🔹 Filters */}
        <div className="flex justify-between items-center">
          <div className="w-100 h-12 border border-[var(--gray-border)] flex text-center justify-center items-center gap-2 p-1 rounded-xl">
            <button
              className={`switch_btn ${filter === "all"
                ? "filter-btn-active"
                : "filter-btn-inactive"
                }`}
              onClick={() => setFilter("all")}
            >
              All Users
            </button>
            <button
              className={`switch_btn ${filter === "admins"
                ? "filter-btn-active"
                : "filter-btn-inactive"
                }`}
              onClick={() => setFilter("admins")}
            >
              Admins
            </button>
            <button
              className={`switch_btn ${filter === "students"
                ? "filter-btn-active"
                : "filter-btn-inactive"
                }`}
              onClick={() => setFilter("students")}
            >
              Students
            </button>
          </div>

          <div className="flex gap-2 align-center justify-center">
            <div className="p-2 flex gap-4 items-center w-65 bg-[var(--gray-bg)] rounded-xl transition-all duration-300 hover:shadow-md">
              <MdOutlineSearch size={28} />
              <input
                type="text"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm outline-none"
              />
            </div>

            <RolesSelection value={roleFilter} onChange={setRoleFilter} />
          </div>
        </div>

        {/* 🔹 User List */}
        <div className="h-full border border-[var(--gray-border)] rounded-xl overflow-scroll">
          <UserList
            users={filteredUsers}
            onChangeRole={handleChangeRole}
          />
        </div>
      </div>
    </div>
  );
}
