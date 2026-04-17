import { useEffect, useState } from "react";
import { MdOutlineSearch, MdRefresh, MdCheckCircle } from "react-icons/md";
import { LuFileText, LuMail, LuCalendar, LuUser } from "react-icons/lu";
import api from "../../../../constants/axios";

interface AttendanceRequest {
  _id: string;
  studentName: string;
  studentEmail: string;
  status: string;
  createdAt: string;
}

const STATUS_FILTERS = ["all", "pending", "sent"] as const;

export default function SSAttendanceRecords() {
  const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/attendance/admin/requests");
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error("Failed to fetch attendance requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = requests
    .filter((req) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        req.studentName.toLowerCase().includes(term) ||
        req.studentEmail.toLowerCase().includes(term);
      const matchStatus = statusFilter === "all" || req.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 my-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="font-bold text-lg sm:text-xl">Student Services Records</h1>
        <div className="flex gap-2 items-center">
          <div className="p-2 flex gap-3 items-center w-full sm:w-72 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] shadow-sm">
            <MdOutlineSearch size={22} color="#666" className="shrink-0" />
            <input
              type="text"
              placeholder="Search by student or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>
          <button
            onClick={fetchRequests}
            className="p-2.5 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] hover:shadow-md transition-all active:scale-95 shrink-0"
            title="Refresh"
          >
            <MdRefresh size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              statusFilter === s
                ? "bg-[var(--primary)] text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-300 bg-white rounded-3xl border border-dashed border-gray-200">
          <LuFileText size={64} className="mb-3 opacity-30" />
          <p className="text-sm font-medium text-gray-400">No requests found</p>
        </div>
      ) : (
        <div className="border border-[var(--gray-border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[500px]">
            <thead className="bg-[var(--gray-bg)] sticky top-0 border-b border-[var(--gray-border)]">
              <tr>
                <th className="p-3 font-semibold text-gray-600">Student Name</th>
                <th className="p-3 font-semibold text-gray-600">Contact Email</th>
                <th className="p-3 font-semibold text-gray-600">Requested On</th>
                <th className="p-3 font-semibold text-gray-600 pl-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req._id} className="border-b border-[var(--gray-border)] hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <LuUser size={14} className="text-[var(--primary)] shrink-0" />
                      <span className="font-medium text-gray-800">{req.studentName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <LuMail size={12} className="text-[var(--primary)]" /> {req.studentEmail}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <LuCalendar size={12} />
                      {new Date(req.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  </td>
                  <td className="p-3">
                    {req.status === "Pending" ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 uppercase">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
                        <MdCheckCircle size={14} className="text-green-700" />
                        <span className="text-xs font-semibold text-green-700 uppercase">Sent</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}