import { useEffect, useState } from "react";
import { LuPackage, LuBadgeCheck, LuLoader, LuClock } from "react-icons/lu";
import api from "../../../constants/axios";

export default function LF_Stats() {
    const [counts, setCounts] = useState({
        total: 0,
        active: 0,
        pending: 0,
        returned: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/api/lost-found/admin/stats", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setCounts(response.data);
            } catch (err) {
                console.error("Error fetching LF stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 mt-6 mx-4 md:mx-10">
            <div className="statscard">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Total Reports</div>
                    <div><LuPackage size={22} color="var(--primary)" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.total}</div>
            </div>

            <div className="statscard">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Active items</div>
                    <div><LuLoader size={22} color="#00A110" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.active}</div>
            </div>

            <div className="statscard border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Pending Handover</div>
                    <div><LuClock size={22} color="#F57F17" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.pending}</div>
            </div>

            <div className="statscard bg-[#F1F8E9]">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Returned Items</div>
                    <div><LuBadgeCheck size={22} color="#217C00" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.returned}</div>
            </div>
        </div>
    );
}
