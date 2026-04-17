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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: AdminPage) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3 flex items-center gap-2">
        <MdOutlinePeople size={14} /> Super Admin
      </p>

      {navItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-5 left-5 z-[60] bg-[var(--primary)] text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-95"
        aria-label="Open menu"
      >
        <MdMenu size={24} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-[70] backdrop-blur-[1px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white z-[80] border-r border-[var(--gray-border)] flex flex-col py-6 px-3 gap-1 shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-3 mb-4">
          <span className="font-bold text-sm text-gray-700">Navigation</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MdClose size={20} className="text-gray-500" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 h-[calc(100vh-65px)] sticky top-[65px] border-r border-[var(--gray-border)] bg-white flex-col py-6 px-3 gap-1">
        {sidebarContent}
      </aside>
    </>
  );
}
