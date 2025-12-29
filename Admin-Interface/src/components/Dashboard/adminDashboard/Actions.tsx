import { useEffect, useRef, useState } from "react";

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
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

const handleDelete = async () => {
  setLoading(true);
  try {
    await onDelete(userId); // userId === _id from Mongo
    setConfirm(false);
    onClose(); // close menu after successful delete
    
  } catch (err) {
    console.error("Failed to delete user:", err);
    alert("Failed to delete user. Please try again.");
  } finally {
    setLoading(false);
  }
};


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
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${r.value===currentRole?"text-gray-400 cursor-not-allowed":""}`}
            onClick={() => {
              if (r.value!==currentRole) onChangeRole(userId,r.value);
              onClose();
            }}>
            {r.label}
          </div>
        ))}
        <div className="px-4 py-2 text-red-600 cursor-pointer hover:bg-red-50 transition-colors font-semibold"
          onClick={() => setConfirm(true)}>Delete User</div>
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-55">
          <div className="bg-white w-80 max-w-sm p-6 rounded-xl shadow-2xl animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800">Delete User</h2>
            <p className="mt-2 text-gray-600">Are you sure you want to delete this user? <br /> This action cannot be undone.</p>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setConfirm(false)} className="px-4 py-2 border rounded-md hover:bg-gray-100">Cancel</button>
              <button onClick={handleDelete} disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${loading?"bg-red-300":"bg-red-600 hover:bg-red-700"}`}>
                {loading?"Deleting...":"Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
