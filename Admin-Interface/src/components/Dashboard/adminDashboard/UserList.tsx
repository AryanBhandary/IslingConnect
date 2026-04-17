import { IoMdMore } from "react-icons/io";
import { useState } from "react";
import Actions from "./Actions";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

interface Props {
  users: User[];
  onChangeRole: (id: string, role: string) => void;
}

export default function UserList({ users, onChangeRole }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (users.length === 0) return <p className="text-center text-gray-500">No users found.</p>;

  const roleText: Record<string, string> = {
    ss_admin: "Students Service Admin",
    lf_admin: "Lost and Found Admin",
    it_admin: "IT Department Admin",
    pat_admin: "PAT Department Admin",
    user: "Student"
  };

  return (
<<<<<<< Updated upstream
    <table className="w-full text-left">
      <thead className="bg-[var(--gray-bg)] sticky top-0 z-50">
        <tr>
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Phone</th>
          <th className="p-3">Joined Date</th>
          <th className="p-3">Role</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => {
          const roleColor = user.role === "ss_admin" ? "bg-[var(--primary-light)] text-[var(--primary)]" :
            user.role === "lf_admin" ? "bg-[var(--lf-bg)] text-[var(--lf)]" :
              user.role === "pat_admin" ? "bg-[var(--pat-bg)] text-[var(--pat)]" :
                user.role === "it_admin" ? "bg-[var(--it-bg)] text-[var(--it)]" :
                  "bg-[var(--std-bg)] text-black";

          return (
            <tr key={user._id} className="border-b border-[var(--gray-border)]">
              <td className="p-3 w-40">{user.username}</td>
              <td className="p-3 w-60">{user.email}</td>
              <td className="p-3 w-35">{user.phone}</td>
              <td className="p-3">{new Date(user.createdAt).toISOString().split("T")[0]}</td>
              <td className="p-3">
                <div className={`py-1 px-5 w-50 rounded-3xl text-sm ${roleColor}`}>
                  {roleText[user.role]}
                </div>
              </td>
              <td className="p-3 text-center relative">
                <IoMdMore size={24} className="cursor-pointer"
                  onClick={() => setOpenId(openId === user._id ? null : user._id)}
                />
=======
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[500px]">
        <thead className="bg-[var(--gray-bg)] sticky top-0 z-10 border-b border-[var(--gray-border)]">
          <tr>
            <th className="p-3 font-semibold text-gray-600">Name</th>
            <th className="p-3 font-semibold text-gray-600 hidden sm:table-cell">Email</th>
            <th className="p-3 font-semibold text-gray-600 hidden md:table-cell">Phone</th>
            <th className="p-3 font-semibold text-gray-600 hidden md:table-cell">Joined</th>
            <th className="p-3 font-semibold text-gray-600">Role</th>
            <th className="p-3 font-semibold text-gray-600 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-[var(--gray-border)] hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="p-3 font-medium text-gray-800">
                <div>{user.username}</div>
                <div className="text-xs text-gray-400 sm:hidden">{user.email}</div>
              </td>
              <td className="p-3 text-gray-500 hidden sm:table-cell">{user.email}</td>
              <td className="p-3 text-gray-500 hidden md:table-cell">{user.phone}</td>
              <td className="p-3 text-gray-500 hidden md:table-cell">
                {new Date(user.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="p-3">
                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${roleColor[user.role] ?? "bg-gray-100 text-gray-500"}`}>
                  {roleText[user.role] ?? user.role}
                </span>
              </td>
              <td className="p-3 text-center relative">
                <button
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  onClick={() => setOpenId(openId === user._id ? null : user._id)}
                >
                  <IoMdMore size={22} className="text-gray-500" />
                </button>
>>>>>>> Stashed changes
                {openId === user._id && (
                  <Actions
                    userId={user._id}
                    currentRole={user.role}
                    onClose={() => setOpenId(null)}
                    onChangeRole={onChangeRole}
<<<<<<< Updated upstream
=======
                    onDelete={onDelete}
>>>>>>> Stashed changes
                  />
                )}
              </td>
            </tr>
<<<<<<< Updated upstream
          );
        })}
      </tbody>
    </table>
=======
          ))}
        </tbody>
      </table>
    </div>
>>>>>>> Stashed changes
  );
}
