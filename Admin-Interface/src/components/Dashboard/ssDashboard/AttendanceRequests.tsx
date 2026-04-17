import { useEffect, useState } from "react";
import { MdOutlineSearch, MdOutlineUploadFile, MdCheckCircle, MdRefresh } from "react-icons/md";
import { LuMail, LuCalendar, LuFileText } from "react-icons/lu";
import api from "../../../constants/axios";

interface AttendanceRequest {
  _id: string;
  studentName: string;
  studentEmail: string;
  status: string;
  createdAt: string;
}

export default function AttendanceRequests() {
  const [requests, setRequests] = useState<AttendanceRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      setUploadingId(id);
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await api.post(`/api/attendance/send-pdf/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status: "Sent" } : req))
        );
      }
    } catch (err) {
      console.error("Failed to send attendance PDF", err);
      alert("Error sending attendance report. Please try again.");
    } finally {
      setUploadingId(null);
      e.target.value = '';
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || req.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-4 md:mx-10 my-4 md:my-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <h1 className="font-bold text-xl">Attendance Report Requests</h1>
        <div className="flex flex-wrap w-full md:w-auto gap-2 items-center">
                    <div className="p-2 flex gap-4 items-center w-full md:w-80 bg-[var(--gray-bg)] rounded-xl border border-[var(--gray-border)] shadow-sm">
              <MdOutlineSearch size={24} color="#666" />
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
                className="p-3 bg-[var(--gray-bg)] text-black rounded-xl border border-[var(--gray-border)] hover:shadow-md transition-all active:scale-95"
                title="Refresh"
            >
                <MdRefresh size={24} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "sent"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              statusFilter === status
                ? "bg-[var(--primary)] text-white shadow-lg translate-y-[-2px]"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
          <LuFileText size={80} className="mb-4 opacity-10" />
          <p className="font-medium text-lg text-gray-400">No requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              
              {/* Row 1: Student info */}
              <div className="flex p-5 gap-4 border-b border-gray-50">
                <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-gray-200">
                  <span className="text-xl font-bold text-[var(--primary)]">
                    {req.studentName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg truncate pr-2">{req.studentName}</h3>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2">
                       <LuMail size={14} className="text-gray-400 shrink-0" />
                       <span className="text-xs text-gray-600 font-medium truncate">{req.studentEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <LuCalendar size={14} className="text-gray-400 shrink-0" />
                       <span className="text-xs text-black font-semibold">
                         {new Date(req.createdAt).toLocaleDateString("en-GB", {
                             day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute:"2-digit"
                         })}
                       </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Status & Action */}
              <div className={`px-6 py-4 flex-1 flex items-center justify-between ${req.status === 'Sent' ? 'bg-[#F1F8E9]' : 'bg-[#FBFBFF]'}`}>
                 <div className="flex flex-col gap-1">
                   <p className={`text-[10px] font-bold tracking-widest uppercase ${req.status === 'Sent' ? 'text-[#217C00]' : 'text-[#F57F17]'}`}>
                       Status
                   </p>
                   <span className="text-xs font-bold text-black">{req.status}</span>
                 </div>
                 
                 <div>
                    {req.status === "Pending" ? (
                      <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${uploadingId === req._id ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-black text-white hover:bg-gray-800 shadow-md hover:translate-y-[-1px]'}`}>
                        <MdOutlineUploadFile size={16} />
                        {uploadingId === req._id ? 'Sending...' : 'Send PDF'}
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, req._id)}
                          disabled={uploadingId === req._id}
                        />
                      </label>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-[#217C00] border-opacity-20 shadow-sm">
                        <MdCheckCircle size={16} className="text-[#217C00]" />
                        <span className="text-xs font-bold text-[#217C00] uppercase tracking-wider">Completed</span>
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
