import { useState } from "react";
import { MdOutlinePeople, MdOutlineDashboard, MdOutlineComputer, MdOutlineSchool, MdMenu, MdClose } from "react-icons/md";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile FAB */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed bottom-6 left-6 z-[100] w-12 h-12 bg-[var(--primary)] text-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-blue-50 active:scale-95 transition-all duration-300"
      >
        {isMobileMenuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 md:top-[65px] left-0 z-[95] md:z-40
        w-[80%] md:w-64 h-full md:h-[calc(100vh-65px)]
        bg-white border-r border-[var(--gray-border)] shadow-2xl md:shadow-none 
        flex flex-col py-8 md:py-6 px-4 md:px-5 gap-2
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <p className="flex text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-4 items-center gap-2">
          <MdOutlinePeople size={14} /> Super Admin
        </p>

        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 w-full text-left relative group overflow-hidden ${
                isActive
                  ? "text-white shadow-lg shadow-gray-200/50"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={isActive ? { backgroundColor: item.color } : {}}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="tracking-wide z-10 relative">{item.label}</span>
            </button>
          );
        })}
      </aside>
    </>
  );
}
