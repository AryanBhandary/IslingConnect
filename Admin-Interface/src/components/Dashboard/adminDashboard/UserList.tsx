import { IoMdMore } from "react-icons/io";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
    
  if (users.length === 0) {
    return <p className="text-center text-gray-500">No users found.</p>;
  }

  const roleText: Record<string, string> = {
    ss_admin: "Students Service Admin",
    lf_admin: "Lost and Found Admin",
    it_admin: "IT Department Admin",
    pat_admin: "PAT Department Admin",
    user: "Student"
  }


  return (
    <>

    <table className="w-full text-left font-normal">
        <thead>
            <tr className="border-b">
                <th className="w-50">Name</th>
                <th className="w-80">Email</th>
                <th className="w-50">Phone</th>
                <th className="w-50">Joined Date</th>
                <th className="w-100">Role</th>
                <th className="w-20">Actions</th> 
            </tr>
        </thead>
        <tbody>
        {users.map((user) => {
          let roleColor = "";
          switch (user.role) {
            case "ss_admin":
                roleColor = "bg-[var(--primary-light)] text-[var(--primary)]";
                break;
            case "lf_admin":
                roleColor = "bg-[var(--lf-bg)] text-[var(--lf)]";
                break;
            case "pat_admin":
                roleColor = "bg-[var(--pat-bg)] text-[var(--pat)]";
                break;
            case "it_admin":
              roleColor = "bg-[var(--it-bg)] text-[var(--it)]";
              break;
            case "user":
              roleColor = "bg-[var(--std-bg)] text-black";
              break;
            default:
              roleColor = "bg-gray-100 text-gray-800";
          }

          return (
            <tr key={user._id} className="border-b border-b-[var(--gray-border)]">
              <td className="user-list-items ">{user.username}</td>
              <td className="user-list-items ">{user.email}</td>
              <td className="user-list-items ">{user.phone}</td>
              <td className="user-list-items ">
                {new Date(user.createdAt).toISOString().split("T")[0]}
              </td>
              <td className="flex py-2">
                <div
                  className={`py-1 px-5  rounded-3xl font-light text-center text-sm ${roleColor}`}
                >
                  {roleText[user.role] || "Unknown Role"}
                </div>
                
              </td>
              <td className="p-2 text-center">
                <IoMdMore size={24} className="cursor-pointer" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </>
  );
}
