import { useEffect, useState } from "react";
import { LuCalendar, LuClock, LuBadgeCheck, LuCircleX } from "react-icons/lu";
import api from "../../../constants/axios";

export default function PAT_Stats() {
    const [counts, setCounts] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/api/appointments/admin/pat/stats");
                setCounts(response.data);
            } catch (err) {
                console.error("Error fetching PAT stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 mt-6 mx-4 md:mx-10">
            <div className="statscard">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Total Appointments</div>
                    <div><LuCalendar size={22} color="var(--pat)" /></div>
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
                    <div className="font-bold text-sm text-[var(--ia-text)]">Confirmed</div>
                    <div><LuBadgeCheck size={22} color="#00A110" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.confirmed}</div>
            </div>

            <div className="statscard">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ia-text)]">Cancelled</div>
                    <div><LuCircleX size={22} color="#FF0000" /></div>
                </div>
                <div className="font-bold text-3xl mt-2">{counts.cancelled}</div>
            </div>
        </div>
    );
}
