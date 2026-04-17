import { useEffect, useState } from "react";
import { LuFileText, LuClock, LuBadgeCheck } from "react-icons/lu";
import api from "../../../constants/axios";

export default function SS_Stats() {
    const [counts, setCounts] = useState({
        total: 0,
        pending: 0,
        sent: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/api/attendance/admin/stats");
                setCounts(response.data);
            } catch (err) {
                console.error("Error fetching SS stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 mt-6 mx-4 sm:mx-6 lg:mx-10">
            <div className="statscard">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Total Requests</div>
                    <div><LuFileText size={22} color="var(--primary)" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.total}</div>
            </div>

            <div className="statscard">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Pending</div>
                    <div><LuClock size={22} color="#F57F17" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.pending}</div>
            </div>

            <div className="statscard">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Sent</div>
                    <div><LuBadgeCheck size={22} color="#00A110" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.sent}</div>
            </div>
        </div>
    );
}
