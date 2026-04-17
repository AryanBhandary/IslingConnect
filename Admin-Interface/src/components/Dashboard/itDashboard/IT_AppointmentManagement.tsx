import { useEffect, useState } from "react";
import { MdOutlineSearch, MdCheck, MdClose, MdRefresh } from "react-icons/md";
import { LuUser, LuMail, LuPhone, LuCalendar, LuClock, LuFileText, LuBadgeCheck, LuCircleCheckBig } from "react-icons/lu";
import api from "../../../constants/axios";

interface Appointment {
    _id: string;
    studentName: string;
    registeredName: string;
    registeredEmail: string;
    registeredPhone: string;
    title: string;
    department: string;
    date: string;
    time: string;
    status: string;
    rescheduledDate?: string;
    rescheduledTime?: string;
    createdAt: string;
}

export default function IT_AppointmentManagement() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isRescheduling, setIsRescheduling] = useState<string | null>(null);
    const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/appointments/admin/it/all");
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch IT appointments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (id: string, status: string, additionalData = {}) => {
        try {
            await api.put(`/api/appointments/admin/it/update-status/${id}`, { status, ...additionalData });
            setAppointments(prev => prev.map(app => app._id === id ? { ...app, status, ...additionalData } : app));
            setIsRescheduling(null);
        } catch (err) {
            console.error("Failed to update IT status", err);
        }
    };

    const filteredAppointments = appointments
        .filter(app => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                app.studentName.toLowerCase().includes(term) ||
                app.registeredEmail.toLowerCase().includes(term) ||
                app.registeredPhone?.toLowerCase().includes(term) ||
                app.title.toLowerCase().includes(term);
            const matchesStatus = statusFilter === "all" || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="mx-4 md:mx-10 my-4 md:my-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
                <h1 className="font-bold text-xl">IT Appointment Management</h1>
                <div className="flex flex-wrap w-full md:w-auto gap-2 items-center">
                    <div className="p-2 flex gap-4 items-center w-full md:w-80 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] shadow-sm">
                        <MdOutlineSearch size={24} color="#666" />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-sm outline-none bg-transparent"
                        />
                    </div>
                    <button
                        onClick={fetchAppointments}
                        className="p-3 bg-[var(--gray-bg)] text-black rounded-xl border border-[var(--gray-border)] hover:shadow-md transition-all active:scale-95"
                        title="Refresh"
                    >
                        <MdRefresh size={24} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(["all", "Pending", "Confirmed", "Completed", "Cancelled", "Reschedule Requested"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${statusFilter === status
                            ? "bg-[var(--it)] text-white shadow-lg translate-y-[-2px]"
                            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        {status === "all" ? "All" : status === "Reschedule Requested" ? "Requests" : status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--it)]"></div>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
                    <LuCalendar size={80} className="mb-4 opacity-10" />
                    <p className="font-medium text-lg text-gray-400">No appointments found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-6">
                    {filteredAppointments.map((app) => (
                        <div key={app._id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            {/* Row 1: Appointment Info */}
                            <div className="p-5 border-b border-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg truncate pr-2">{app.title}</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <LuCalendar size={16} color="#000" className="shrink-0" />
                                        <span className="text-xs font-semibold">
                                            {new Date(app.date).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuClock size={16} color="#000" className="shrink-0" />
                                        <span className="text-xs text-black font-semibold">{app.time}</span>
                                    </div>
                                    {app.status === "Reschedule Requested" && app.rescheduledDate && (
                                        <div className="flex items-center gap-2 bg-[#E3F2FD] rounded-xl px-3 py-2">
                                            <LuFileText size={14} className="text-[#1565C0] shrink-0" />
                                            <span className="text-[10px] font-bold text-[#1565C0]">
                                                Proposed: {new Date(app.rescheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {app.rescheduledTime}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Student Information */}
                            <div className="px-6 py-4 border-b border-gray-50 bg-[#FBFBFF]">
                                <p className="text-[10px] font-bold text-[#A0A0A0] tracking-widest uppercase mb-3">Student Information</p>
                                <div className="flex flex-wrap gap-y-2">
                                    <div className="flex items-center gap-2 w-1/2 min-w-[140px]">
                                        <LuUser size={14} className="text-[var(--it)]" />
                                        <span className="text-xs font-bold text-black">{app.studentName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-1/2 min-w-[140px]">
                                        <LuPhone size={14} className="text-[var(--it)]" />
                                        <span className="text-xs font-semibold text-gray-700">{app.registeredPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 w-full mt-1">
                                        <LuMail size={14} className="text-[var(--it)]" />
                                        <span className="text-xs text-gray-500 font-medium">{app.registeredEmail}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Actions */}
                            <div className="px-6 py-3 bg-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <LuClock size={14} className="text-gray-400" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                        {new Date(app.createdAt).toLocaleString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {app.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(app._id, "Confirmed")}
                                                className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                                title="Accept"
                                            >
                                                <MdCheck size={20} />
                                            </button>
                                            <button
                                                onClick={() => setIsRescheduling(app._id)}
                                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                                title="Reschedule"
                                            >
                                                <MdRefresh size={20} />
                                            </button>
                                        </>
                                    )}
                                    {app.status === "Confirmed" && (
                                        <div className="flex items-center gap-1.5">
                                            <LuBadgeCheck size={16} className="text-[#217C00]" />
                                            <span className="text-[10px] font-bold text-[#217C00] uppercase">Confirmed</span>
                                        </div>
                                    )}
                                    {app.status === "Cancelled" && (
                                        <div className="flex items-center gap-1.5">
                                            <MdClose size={16} className="text-[#FF0000]" />
                                            <span className="text-[10px] font-bold text-[#FF0000] uppercase">Cancelled</span>
                                        </div>
                                    )}
                                    {app.status === "Reschedule Requested" && (
                                        <div className="flex items-center gap-1.5">
                                            <MdRefresh size={16} className="text-[#1565C0]" />
                                            <span className="text-[10px] font-bold text-[#1565C0] uppercase">Awaiting Student</span>
                                        </div>
                                    )}
                                    {app.status === "Completed" && (
                                        <div className="flex items-center gap-1.5">
                                            <LuCircleCheckBig size={16} className="text-[#6D28D9]" />
                                            <span className="text-[10px] font-bold text-[#6D28D9] uppercase">Completed</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reschedule Modal */}
            {isRescheduling && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[100] backdrop-blur-[1px]">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-[var(--gray-border)]">
                        <h2 className="font-bold text-lg mb-4">Reschedule Appointment</h2>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500">Proposed Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-[var(--gray-border)] rounded-xl outline-none focus:border-[var(--it)]"
                                    value={rescheduleData.date}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500">Proposed Time</label>
                                <input
                                    type="time"
                                    className="w-full p-2 border border-[var(--gray-border)] rounded-xl outline-none focus:border-[var(--it)]"
                                    value={rescheduleData.time}
                                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => handleUpdateStatus(isRescheduling, "Reschedule Requested", {
                                    rescheduledDate: rescheduleData.date,
                                    rescheduledTime: rescheduleData.time
                                })}
                                disabled={!rescheduleData.date || !rescheduleData.time}
                                className="flex-1 py-2 bg-[var(--it)] text-white font-bold rounded-xl disabled:opacity-50"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setIsRescheduling(null)}
                                className="flex-1 py-2 bg-gray-100 text-gray-500 font-bold rounded-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
