import { useEffect, useState } from "react";
import { MdOutlineSearch, MdRefresh } from "react-icons/md";
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
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/getAll");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Change role
  const handleChangeRole = async (id: string, role: string) => {
    await api.put(`/api/admin/users/${id}/role`, { role });
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  // Delete user
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users
    .filter((user: User) => {
      if (filter === "admins") {
        if (!["ss_admin", "lf_admin", "pat_admin", "it_admin"].includes(user.role)) return false;
      }
      if (filter === "students") {
        if (user.role !== "user") return false;
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
      return ["ss_admin", "lf_admin", "pat_admin", "it_admin", "user"].includes(user.role);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mx-10 my-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl">User Management</h1>
        <div className="flex gap-2 items-center">
          <div className="p-2 flex gap-3 items-center w-72 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] shadow-sm">
            <MdOutlineSearch size={22} color="#666" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>
          <RolesSelection value={roleFilter} onChange={setRoleFilter} />
          <button
            onClick={fetchUsers}
            className="p-2.5 bg-[var(--gray-bg)] text-black rounded-xl border border-[var(--gray-border)] hover:shadow-md transition-all active:scale-95"
            title="Refresh"
          >
            <MdRefresh size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5">
        {(["all", "admins", "students"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              filter === f
                ? "bg-[var(--primary)] text-white shadow-lg translate-y-[-2px]"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[var(--gray-border)] rounded-2xl overflow-hidden shadow-sm" style={{ maxHeight: "50vh", overflowY: "auto" }}>
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
          </div>
        ) : (
          <UserList
            users={filteredUsers}
            onChangeRole={handleChangeRole}
            onDelete={handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
}
