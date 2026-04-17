import { useEffect, useState } from "react";
import { LuCalendar, LuClock, LuUser, LuMail, LuPhone } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import api from "../../../constants/axios";

interface Appointment {
    _id: string;
    studentName: string;
    registeredEmail: string;
    registeredPhone: string;
    title: string;
    date: string;
    time: string;
    status: string;
    createdAt: string;
}

export default function PAT_TodayAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/api/appointments/admin/pat/${id}/status`, { status });
            fetchAppointments();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/appointments/admin/pat/all");
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todayApps = res.data.filter((app: Appointment) => {
                const appDate = new Date(app.date);
                appDate.setHours(0, 0, 0, 0);
                return appDate >= today && appDate < tomorrow;
            });
            setAppointments(todayApps);
        } catch (err) {
            console.error("Failed to fetch PAT appointments", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAppointments();
    }, []);

    const todayStr = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="mx-4 sm:mx-6 lg:mx-10 my-5">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="font-bold text-xl">Today's Appointments</h1>
                    <p className="text-xs text-[var(--ia-text)] mt-1">{todayStr}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${appointments.length > 0 ? 'bg-[var(--pat-bg)] text-[var(--pat)]' : 'bg-gray-100 text-gray-400'}`}>
                        {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--pat)]"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="flex items-center justify-center p-8 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="flex items-center gap-3 text-gray-300">
                        <LuCalendar size={24} />
                        <p className="text-sm font-medium">No appointments scheduled for today</p>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {appointments
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((app) => (
                            <div key={app._id} className="min-w-[320px] max-w-[320px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                                {/* Top accent bar */}
                                <div className={`h-1.5 ${app.status === "Confirmed" ? "bg-[#217C00]" :
                                    app.status === "Pending" ? "bg-[#F57F17]" :
                                        app.status === "Cancelled" ? "bg-[#FF0000]" :
                                            "bg-[#1565C0]"
                                    }`} />

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-sm truncate pr-2">"{app.title}"</h3>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <LuClock size={14} className="text-[var(--pat)]" />
                                            <span className="text-xs font-bold text-[var(--pat)]">{app.time}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 mb-3">
                                        <div className="flex items-center gap-2">
                                            <LuUser size={13} className="text-gray-400 shrink-0" />
                                            <span className="text-xs font-semibold text-black">{app.studentName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LuMail size={13} className="text-gray-400 shrink-0" />
                                            <span className="text-[11px] text-gray-500">{app.registeredEmail}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LuPhone size={13} className="text-gray-400 shrink-0" />
                                            <span className="text-[11px] text-gray-500">{app.registeredPhone}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                        <span className={`text-[10px] font-bold uppercase ${app.status === "Confirmed" ? "text-[#217C00]" :
                                            app.status === "Pending" ? "text-[#F57F17]" :
                                                app.status === "Cancelled" ? "text-[#FF0000]" :
                                                    "text-[#1565C0]"
                                            }`}>
                                            {app.status}
                                        </span>
                                        {app.status === "Pending" && (
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, "Confirmed")}
                                                    className="p-1 bg-green-50 text-green-600 rounded-md hover:bg-green-600 hover:text-white transition-all"
                                                    title="Accept"
                                                >
                                                    <MdCheck size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
