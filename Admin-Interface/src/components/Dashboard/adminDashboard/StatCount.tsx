import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { MdOutlineShield } from "react-icons/md";
import { FiUser } from "react-icons/fi";


import api from "../../../constants/axios";


export default function StatCount() {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await api.get("/api/admin/count");
        setCounts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, []);
  return (
    <>
      <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 mt-5 mx-4 sm:mx-6 lg:mx-10 mb-2">
        <div className="statscard">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-[var(--ia-text)]">Total Users</div>
            <div>
              <LuUsers size={22} color="#00A110" />
            </div>
          </div>
          <div className="font-bold text-3xl mt-2">{counts.totalUsers}</div>
        </div>

        <div className="statscard">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-[var(--ia-text)]">Total Admins</div>
            <div><MdOutlineShield size={22} color="#006FFF"/></div>
          </div>
          <div className="font-bold text-3xl mt-2">{counts.totalAdmins}</div>
        </div>

        <div className="statscard">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-[var(--ia-text)]">Total Students</div>
             <div><FiUser size={22} color="#919191"/></div>
          </div>
          <div className="font-bold text-3xl mt-2">{counts.totalStudents}</div>
        </div>
      </div>
    </>
  );
}
