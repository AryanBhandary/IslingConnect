import { useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa";

const selectRole = [
  { label: "All Roles", value: "all" },
  { label: "SS Admin", value: "ss_admin" },
  { label: "LF Admin", value: "lf_admin" },
  { label: "PAT Admin", value: "pat_admin" },
  { label: "IT Admin", value: "it_admin" },
  { label: "Students", value: "user" },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RolesSelection( { value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const currentRole = selectRole.find((r) => r.value === value)?.label;

  return (
    <div className="relative w-40">
      <div
        className="h-12 flex justify-between p-2 gap-4 text-sm items-center bg-[var(--gray-bg)] rounded-xl cursor-pointer hover:shadow-md transition-all duration-300"
        onClick={() => setOpen(!open)}
      >
        <div>{currentRole}</div>
        <FaChevronDown size={14} />
      </div>

      {open && (
        <div className="absolute mt-2 w-full bg-white border border-[var(--gray-border)] rounded-xl shadow-sm z-10">
          {selectRole.map((role) => (
            <div
              key={role.value}
              onClick={() => {
                onChange(role.value);
                setOpen(false);
              }}
              className={`flex items-center justify-between font-light px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all duration-300 rounded-xl${
                value === role.value
                  ? "font-semibold bg-[var(--gray-border)] rounded-xl"
                  : ""
              }`}
            >
              <span>{role.label}</span>
              {value === role.value && <FaCheck size={12} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
