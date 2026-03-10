import { useEffect, useState } from "react";
import { MdOutlineSearch, MdCheck, MdClose, MdRefresh } from "react-icons/md";
import NavBar from "../Navbar";
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

export default function PAT_Admin() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isRescheduling, setIsRescheduling] = useState<string | null>(null);
    const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/appointments/admin/pat/all");
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch PAT appointments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (id: string, status: string, additionalData = {}) => {
        try {
            await api.put(`/api/appointments/admin/pat/update-status/${id}`, { status, ...additionalData });
            setAppointments(prev => prev.map(app => app._id === id ? { ...app, status, ...additionalData } : app));
            setIsRescheduling(null);
        } catch (err) {
            console.error("Failed to update PAT status", err);
        }
    };

    const filteredAppointments = appointments
        .filter(app => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                app.studentName.toLowerCase().includes(term) ||
                app.registeredEmail.toLowerCase().includes(term) ||
                app.title.toLowerCase().includes(term);
            const matchesStatus = statusFilter === "all" || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <>
            <NavBar />
            <div className="mx-10 my-5">
                <h1 className="font-bold text-xl">PAT Appointment Management</h1>

                <div className="flex flex-col gap-2 justify-center max-w-full h-130 max-h-130 border border-[var(--gray-border)] mt-3 p-2 rounded-xl bg-white">
                    {/* Filters & Search */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="w-[500px] h-12 border border-[var(--gray-border)] flex text-center justify-center items-center gap-2 p-1 rounded-xl">
                            {["all", "Pending", "Confirmed", "Cancelled", "Reschedule Requested"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`switch_btn text-xs font-semibold ${statusFilter === f ? "filter-btn-active" : "filter-btn-inactive"
                                        }`}
                                    style={{ width: '20%' }}
                                >
                                    {f === "all" ? "All" : f === "Reschedule Requested" ? "Requests" : f}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 align-center justify-center">
                            <div className="p-2 flex gap-4 items-center w-65 bg-[var(--gray-bg)] rounded-xl transition-all duration-300 hover:shadow-md">
                                <MdOutlineSearch size={28} />
                                <input
                                    type="text"
                                    placeholder="Search Appointments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full text-sm outline-none bg-transparent"
                                />
                            </div>
                            <button
                                onClick={fetchAppointments}
                                className="p-3 bg-[var(--gray-bg)] text-black rounded-xl hover:shadow-md transition-all active:scale-95"
                                title="Refresh"
                            >
                                <MdRefresh size={24} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="h-full border border-[var(--gray-border)] rounded-xl overflow-scroll">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--gray-bg)] sticky top-0 z-10">
                                <tr>
                                    <th className="p-3">Student</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Date & Time</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-light">Loading PAT appointments...</td></tr>
                                ) : filteredAppointments.length === 0 ? (
                                    <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-light">No appointments found.</td></tr>
                                ) : filteredAppointments.map(app => (
                                    <tr key={app._id} className="border-b border-[var(--gray-border)] transition-colors hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="font-semibold">{app.studentName}</div>
                                            <div className="text-[10px] text-gray-400">{app.registeredEmail}</div>
                                        </td>
                                        <td className="p-3 text-sm italic">"{app.title}"</td>
                                        <td className="p-3 text-sm">
                                            <div className="font-semibold">{new Date(app.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500">{app.time}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className={`py-1 px-4 rounded-3xl text-xs text-center font-bold ${app.status === "Confirmed" ? "bg-green-100 text-green-700" :
                                                    app.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                                        app.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                                            "bg-blue-100 text-blue-700"
                                                }`}>
                                                {app.status}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
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
                                                        <button
                                                            onClick={() => handleUpdateStatus(app._id, "Cancelled")}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                            title="Decline"
                                                        >
                                                            <MdClose size={20} />
                                                        </button>
                                                    </>
                                                )}
                                                {(app.status === "Confirmed" || app.status === "Reschedule Requested") && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(app._id, "Cancelled")}
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                        title="Cancel"
                                                    >
                                                        <MdClose size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

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
                                        className="w-full p-2 border border-[var(--gray-border)] rounded-xl outline-none focus:border-[var(--pat)]"
                                        value={rescheduleData.date}
                                        onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500">Proposed Time</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 border border-[var(--gray-border)] rounded-xl outline-none focus:border-[var(--pat)]"
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
                                    className="flex-1 py-2 bg-[var(--pat)] text-white font-bold rounded-xl disabled:opacity-50"
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
        </>
    );
}