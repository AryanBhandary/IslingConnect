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
  onDeleteUser: (id: string) => void;
}

export default function UserList({ users, onChangeRole, onDeleteUser }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (users.length === 0) return <p className="text-center text-gray-500">No users found.</p>;

  const roleText: Record<string,string> = {
    ss_admin: "Students Service Admin",
    lf_admin: "Lost and Found Admin",
    it_admin: "IT Department Admin",
    pat_admin: "PAT Department Admin",
    user: "Student"
  };

  return (
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
          let roleColor = user.role==="ss_admin"?"bg-[var(--primary-light)] text-[var(--primary)]":
                          user.role==="lf_admin"?"bg-[var(--lf-bg)] text-[var(--lf)]":
                          user.role==="pat_admin"?"bg-[var(--pat-bg)] text-[var(--pat)]":
                          user.role==="it_admin"?"bg-[var(--it-bg)] text-[var(--it)]":
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
                  onClick={() => setOpenId(openId===user._id?null:user._id)}
                />
                {openId === user._id && (
                  <Actions
                    userId={user._id}
                    currentRole={user.role}
                    onClose={() => setOpenId(null)}
                    onChangeRole={onChangeRole}
                    onDelete={onDeleteUser}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
