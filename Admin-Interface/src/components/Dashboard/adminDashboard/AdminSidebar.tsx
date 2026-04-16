import { MdOutlinePeople, MdOutlineDashboard, MdOutlineComputer, MdOutlineSchool } from "react-icons/md";
import { LuPackage, LuFileText } from "react-icons/lu";

export type AdminPage = "overview" | "ss-attendance" | "it-appointments" | "pat-appointments" | "lost-found";

interface Props {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
}

const navItems: { id: AdminPage; label: string; icon: React.ReactNode; color: string }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <MdOutlineDashboard size={20} />,
    color: "var(--primary)",
  },
  {
    id: "ss-attendance",
    label: "Student Services",
    icon: <LuFileText size={20} />,
    color: "var(--primary-light)",
  },
  {
    id: "it-appointments",
    label: "IT Appointments",
    icon: <MdOutlineComputer size={20} />,
    color: "var(--it)",
  },
  {
    id: "pat-appointments",
    label: "PAT Appointments",
    icon: <MdOutlineSchool size={20} />,
    color: "var(--pat)",
  },
  {
    id: "lost-found",
    label: "Lost & Found",
    icon: <LuPackage size={20} />,
    color: "var(--lf)",
  },
];

export default function AdminSidebar({ activePage, onNavigate }: Props) {
  return (
    <aside className="w-60 shrink-0 h-[calc(100vh-65px)] sticky top-[65px] border-r border-[var(--gray-border)] bg-white flex flex-col py-6 px-3 gap-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 flex items-center gap-2">
        <MdOutlinePeople size={14} /> Super Admin
      </p>

      {navItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 w-full text-left ${
              isActive
                ? "text-white shadow-sm"
                : "text-gray-500 hover:bg-[var(--gray-bg)] hover:text-gray-800"
            }`}
            style={isActive ? { backgroundColor: item.color } : {}}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </aside>
  );
}
