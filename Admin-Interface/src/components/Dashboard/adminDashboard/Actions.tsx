import { useEffect, useRef } from "react";

interface Props {
  userId: string;
  currentRole: string;
  onClose: () => void;
  onChangeRole: (id: string, role: string) => void;
}

const ROLES = [
  { value: "ss_admin", label: "Make SS Admin" },
  { value: "lf_admin", label: "Make LF Admin" },
  { value: "it_admin", label: "Make IT Admin" },
  { value: "pat_admin", label: "Make PAT Admin" },
  { value: "user", label: "Make Student" },
];

export default function Actions({ userId, currentRole, onClose, onChangeRole }: Props) {
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
    <>
      <div ref={menuRef} className="absolute right-8 top-2 bg-white border rounded-lg shadow-lg w-44 z-20 overflow-hidden">
        {ROLES.map(r => (
          <div key={r.value}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${r.value === currentRole ? "text-gray-400" : ""}`}
            onClick={() => {
              if (r.value !== currentRole) onChangeRole(userId, r.value);
              onClose();
            }}>
            {r.label}
          </div>
        ))}
      </div>
    </>
  );
}
