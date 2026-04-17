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
  ss_admin: "bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary-light)]",
  lf_admin: "bg-[var(--lf-bg)] text-[var(--lf)] border-[var(--lf-bg)]",
  pat_admin: "bg-[var(--pat-bg)] text-[var(--pat)] border-[var(--pat-bg)]",
  it_admin: "bg-[var(--it-bg)] text-[var(--it)] border-[var(--it-bg)]",
  user: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function UserList({ users, onChangeRole, onDelete }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (users.length === 0)
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
        <p className="font-medium text-sm">No users found.</p>
      </div>
    );

  return (
    <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px] max-h-[400px]">
      <thead className="bg-[#FAFAFA] sticky top-0 z-10 border-b border-[var(--gray-border)]">
        <tr>
          <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest pl-6">Identifier</th>
          <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Contact</th>
          <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Joined</th>
          <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Role</th>
          <th className="p-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-center pr-6">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {users.map((user) => (
          <tr
            key={user._id}
            className="hover:bg-gray-50/50 transition-colors duration-200 group"
          >
            <td className="p-4 pl-6">
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-gray-800 tracking-tight">{user.username}</p>
              </div>
            </td>
            <td className="p-4">
               <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-gray-600 block">{user.email}</span>
                  <span className="text-[11px] text-gray-400">{user.phone}</span>
               </div>
            </td>
            <td className="p-4">
               <div className="flex flex-col gap-0.5">
                  <span className="text-gray-600 font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[11px] text-gray-400">
                     {new Date(user.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}
                  </span>
               </div>
            </td>
            <td className="p-4">
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${roleColor[user.role] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                {roleText[user.role] ?? user.role}
              </span>
            </td>
            <td className="p-4 text-center relative pr-6">
              <button
                className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer text-gray-500"
                onClick={() => setOpenId(openId === user._id ? null : user._id)}
              >
                <IoMdMore size={18} />
              </button>
              {openId === user._id && (
                <div className="absolute right-8 top-12 z-[50]">
                  <Actions
                    userId={user._id}
                    currentRole={user.role}
                    onClose={() => setOpenId(null)}
                    onChangeRole={onChangeRole}
                    onDelete={onDelete}
                  />
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
