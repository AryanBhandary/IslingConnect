import { useState } from "react";
import NavBar from "../Navbar";
import SS_Stats from "./SS_Stats";
import AttendanceRequests from "./AttendanceRequests";
import ReportModal from "../common/ReportModal";
import { LuFileText } from "react-icons/lu";

export default function SS_Admin() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            <NavBar />
            <SS_Stats />
            <AttendanceRequests />

            {/* Floating Report Button */}
            <button
                onClick={() => setIsReportModalOpen(true)}
                className="fixed bottom-10 right-10 z-[100] bg-[#1D289C] text-white font-bold py-3 px-8 rounded-full shadow-2xl hover:bg-[#09138aff] transition-all active:scale-95 flex items-center gap-2"
            >
                <LuFileText size={20} />
                <span>Generate Report</span>
            </button>

            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
            />
        </div>
    )
}