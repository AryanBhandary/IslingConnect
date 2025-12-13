import axios from "axios";
import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { MdOutlineShield } from "react-icons/md";
import { FiUser } from "react-icons/fi";


export default function StatCount() {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/admin/count"
        );
        setCounts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, []);
  return (
    <>
      <div className="flex gap-4 mt-6 ml-10">
        <div className="w-70 h-30 border-2 border-[var(--gray-bg)] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="font-bold">Total Users</div>
            <div>
              <LuUsers size={24} color="#00A110" />
            </div>
          </div>
          <div className="font-bold text-4xl">{counts.totalUsers}</div>
        </div>

        <div className="w-70 h-30 border-2 border-[var(--gray-bg)] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="font-bold">Total Admins</div>
            <div><MdOutlineShield size={24} color="#006FFF"/></div>
          </div>
          <div className="font-bold text-4xl">{counts.totalAdmins}</div>
        </div>

        <div className="w-70 h-30 border-2 border-[var(--gray-bg)] rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="font-bold">Total Students</div>
             <div><FiUser size={24} color="#919191"/></div>
          </div>
          <div className="font-bold text-4xl">{counts.totalStudents}</div>
        </div>
      </div>
    </>
  );
}
