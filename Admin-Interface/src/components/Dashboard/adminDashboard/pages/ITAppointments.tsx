import { useEffect, useState } from "react";
import { MdOutlineSearch, MdRefresh } from "react-icons/md";
import { LuCalendar, LuUser, LuMail, LuPhone, LuClock, LuBadgeCheck, LuCircleCheckBig } from "react-icons/lu";
import { MdCheck, MdClose } from "react-icons/md";
import api from "../../../../constants/axios";

interface Appointment {
  _id: string;
  studentName: string;
  registeredEmail: string;
  registeredPhone: string;
  title: string;
  date: string;
  time: string;
  status: string;
  rescheduledDate?: string;
  rescheduledTime?: string;
  createdAt: string;
}

const STATUS_FILTERS = ["all", "Pending", "Confirmed", "Completed", "Cancelled", "Reschedule Requested"] as const;

const statusBadge: Record<string, string> = {
  Pending: "bg-yellow-50 text-yellow-700",
  Confirmed: "bg-green-50 text-green-700",
  Completed: "bg-purple-50 text-purple-700",
  Cancelled: "bg-red-50 text-red-600",
  "Reschedule Requested": "bg-blue-50 text-blue-700",
};

export default function ITAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => { fetchAppointments(); }, []);

  const filtered = appointments
    .filter((app) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        app.studentName.toLowerCase().includes(term) ||
        app.registeredEmail.toLowerCase().includes(term) ||
        app.registeredPhone?.toLowerCase().includes(term) ||
        app.title.toLowerCase().includes(term);
      const matchStatus = statusFilter === "all" || app.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mx-8 my-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl">IT Appointments</h1>
        <div className="flex gap-2 items-center">
          <div className="p-2 flex gap-3 items-center w-72 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] shadow-sm">
            <MdOutlineSearch size={22} color="#666" />
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
            className="p-2.5 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] hover:shadow-md transition-all active:scale-95"
            title="Refresh"
          >
            <MdRefresh size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              statusFilter === s
                ? "bg-[var(--it)] text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "All" : s === "Reschedule Requested" ? "Reschedule Req." : s}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--it)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-300 bg-white rounded-3xl border border-dashed border-gray-200">
          <LuCalendar size={64} className="mb-3 opacity-30" />
          <p className="text-sm font-medium text-gray-400">No appointments found</p>
        </div>
      ) : (
        <div className="border border-[var(--gray-border)] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--gray-bg)] sticky top-0">
              <tr>
                <th className="p-3 font-semibold text-gray-600">Student</th>
                <th className="p-3 font-semibold text-gray-600">Contact</th>
                <th className="p-3 font-semibold text-gray-600">Issue</th>
                <th className="p-3 font-semibold text-gray-600">Date & Time</th>
                <th className="p-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app._id} className="border-b border-[var(--gray-border)] hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <LuUser size={14} className="text-[var(--it)] shrink-0" />
                      <span className="font-medium text-gray-800">{app.studentName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <LuMail size={12} className="text-[var(--it)]" /> {app.registeredEmail}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <LuPhone size={12} className="text-[var(--it)]" /> {app.registeredPhone}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 max-w-[180px]">
                    <span className="text-gray-700 font-medium truncate block">{app.title}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <LuCalendar size={12} />
                        {new Date(app.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LuClock size={12} /> {app.time}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[app.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
