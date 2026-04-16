import { useEffect, useRef } from "react";
import { MdOutlineAdminPanelSettings, MdDeleteOutline } from "react-icons/md";

interface Props {
  userId: string;
  currentRole: string;
  onClose: () => void;
  onChangeRole: (id: string, role: string) => void;
  onDelete: (id: string) => void;
}

const ROLES = [
  { value: "ss_admin", label: "Make SS Admin" },
  { value: "lf_admin", label: "Make LF Admin" },
  { value: "it_admin", label: "Make IT Admin" },
  { value: "pat_admin", label: "Make PAT Admin" },
  { value: "user", label: "Make Student" },
];

export default function Actions({ userId, currentRole, onClose, onChangeRole, onDelete }: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-8 top-2 bg-white border border-gray-100 rounded-2xl shadow-xl w-52 z-20 overflow-hidden"
    >
      {/* Role change section */}
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
          <MdOutlineAdminPanelSettings size={12} /> Change Role
        </p>
        {ROLES.map((r) => (
          <div
            key={r.value}
            className={`px-3 py-2 rounded-xl cursor-pointer text-sm transition-all duration-150 ${
              r.value === currentRole
                ? "text-gray-300 cursor-default"
                : "hover:bg-[var(--gray-bg)] text-gray-700 font-medium"
            }`}
            onClick={() => {
              if (r.value !== currentRole) onChangeRole(userId, r.value);
              onClose();
            }}
          >
            {r.label}
          </div>
        ))}
      </div>

      {/* Delete section */}
      <div className="px-3 py-2">
        <div
          className="px-3 py-2 rounded-xl cursor-pointer text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-all duration-150"
          onClick={() => {
            onDelete(userId);
            onClose();
          }}
        >
          <MdDeleteOutline size={16} />
          Delete User
        </div>
      </div>
    </div>
  );
}
