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
  onDelete: (id: string) => void;
}

const roleText: Record<string, string> = {
  ss_admin: "SS Admin",
  lf_admin: "LF Admin",
  it_admin: "IT Admin",
  pat_admin: "PAT Admin",
  user: "Student",
};

const roleColor: Record<string, string> = {
  ss_admin: "bg-[var(--primary-light)] text-[var(--primary)]",
  lf_admin: "bg-[var(--lf-bg)] text-[var(--lf)]",
  pat_admin: "bg-[var(--pat-bg)] text-[var(--pat)]",
  it_admin: "bg-[var(--it-bg)] text-[var(--it)]",
  user: "bg-[var(--std-bg)] text-black",
};

export default function UserList({ users, onChangeRole, onDelete }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (users.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="font-medium text-sm">No users found.</p>
      </div>
    );

  return (
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
                {openId === user._id && (
                  <Actions
                    userId={user._id}
                    currentRole={user.role}
                    onClose={() => setOpenId(null)}
                    onChangeRole={onChangeRole}
                    onDelete={onDelete}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
