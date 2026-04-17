import { useState, useEffect } from "react";
import { LuFileText, LuDownload, LuX, LuLoader, LuLayoutDashboard } from "react-icons/lu";
import api from "../../../constants/axios";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReportPreview {
    _id: string;
    summary: Record<string, number | string>;
    period: string;
    department: string;
    dataSnapshot: any[];
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [preview, setPreview] = useState<ReportPreview | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await api.post("/api/reports/generate", { period });
            setPreview(res.data.report);
        } catch (err) {
            console.error("Failed to generate report", err);
            alert("Error generating report. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!preview) return;
        setIsDownloading(true);
        try {
            const response = await api.get(`/api/reports/${preview._id}/download`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Report_${preview.department}_${period}_${new Date().toLocaleDateString()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download report", err);
            alert("Error downloading report.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!isOpen) return null;

    const renderTable = () => {
        if (!preview) return null;

        let headers: string[] = [];
        let renderRow: (item: any) => React.ReactNode = () => null;

        if (preview.department === "IT" || preview.department === "PAT") {
            headers = ["Student", "Title", "Date", "Time", "Status"];
            renderRow = (item) => (
                <>
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.studentName}</td>
                    <td className="px-4 py-3 text-gray-600">{item.title}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-500">{item.time}</td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            item.status === "Confirmed" ? "bg-green-100 text-green-700" :
                            item.status === "Pending" ? "bg-orange-100 text-orange-700" :
                            "bg-gray-100 text-gray-700"
                        }`}>
                            {item.status}
                        </span>
                    </td>
                </>
            );
        } else if (preview.department === "LostFound") {
            headers = ["Item (Category)", "Type", "Location", "Uploader", "Reclaimer", "Date", "Status"];
            renderRow = (item) => (
                <>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                        <div>{item.itemName}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{item.category}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 italic text-[11px]">{item.type}</td>
                    <td className="px-4 py-3 text-gray-500 text-[11px] font-medium">{item.location}</td>
                    <td className="px-4 py-3 text-gray-500 text-[11px]">
                        <div className="font-bold text-gray-700">{item.user ? item.user.username : "Anonymous"}</div>
                        {item.user?.phone && <div className="opacity-60">{item.user.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-[11px]">
                        <div className="font-bold text-gray-700">{item.reclaimer ? item.reclaimer.username : "N/A"}</div>
                        {item.reclaimer?.phone && <div className="opacity-60">{item.reclaimer.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            item.status === "returned" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                            {item.status}
                        </span>
                    </td>
                </>
            );
        }
 else if (preview.department === "StudentServices") {
            headers = ["Student Name", "Email", "Description", "Status", "Date"];
            renderRow = (item) => (
                <>
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.studentName}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{item.studentEmail}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{item.description}</td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            item.status === "Sent" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                            {item.status}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                </>
            );
        }

        return (
            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {headers.map(h => <th key={h} className="px-4 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {preview.dataSnapshot.length === 0 ? (
                            <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-gray-400 italic">No records found for this period.</td></tr>
                        ) : (
                            preview.dataSnapshot.map((item, idx) => (
                                <tr key={item._id || idx} className="hover:bg-gray-50/50 transition-colors">
                                    {renderRow(item)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[100] backdrop-blur-[2px] p-3 sm:p-4">
            <div className={`bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[38px] shadow-2xl border border-gray-100 w-full ${
                preview ? "max-w-[950px] max-h-[90vh] overflow-y-auto" : "max-w-[450px]"
            }`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-2xl">
                            <LuFileText size={26} className="text-[var(--primary)]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl sm:text-2xl text-gray-800">Generate Report</h2>
                            {preview && <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">{preview.department} - {period} Basis</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <LuX size={20} className="text-gray-400" />
                    </button>
                </div>

                {!preview ? (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-500 font-medium">Select the timeframe for your report:</p>
                        <div className="grid grid-cols-3 gap-3">
                            {(["Daily", "Weekly", "Monthly"] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`py-3.5 rounded-2xl text-sm font-bold transition-all ${
                                        period === p
                                            ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-4.5 mt-4 bg-[var(--primary)] text-white font-bold rounded-[22px] shadow-xl shadow-blue-100 hover:shadow-2xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <LuLoader className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Preview Report</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="md:col-span-1 border border-gray-100 rounded-[28px] p-4 sm:p-6 bg-gray-50/30">
                                <div className="flex items-center gap-2 mb-6 text-gray-400">
                                    <LuLayoutDashboard size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Summary Statistics</span>
                                </div>
                                <div className="space-y-4">
                                    {Object.entries(preview.summary).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-end border-b border-dashed border-gray-200 pb-1">
                                            <span className="text-xs text-gray-400 font-medium">{key}</span>
                                            <span className="font-bold text-lg leading-none text-gray-800">{value as React.ReactNode}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <LuFileText size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Detailed Records</span>
                                    </div>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {renderTable()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-50">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex-[2] py-4.5 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isDownloading ? (
                                    <LuLoader className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <LuDownload size={22} />
                                        <span>Confirm and Download PDF</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setPreview(null)}
                                className="flex-1 py-4.5 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Change Settings
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
