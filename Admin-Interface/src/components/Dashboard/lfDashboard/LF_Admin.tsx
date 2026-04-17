import { useState } from "react";
import NavBar from "../Navbar";
import LF_Stats from "./LF_Stats";
import LF_ItemManagement from "./LF_ItemManagement";
import ReportModal from "../common/ReportModal";
import { LuFileText } from "react-icons/lu";

export default function LF_Admin() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            <NavBar />
            <LF_Stats />
            <LF_ItemManagement />

            {/* Floating Report Button */}
            <button
                onClick={() => setIsReportModalOpen(true)}
                className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 z-[100] bg-[#1D289C] text-white font-bold py-3 px-6 sm:px-8 rounded-full shadow-2xl hover:bg-[#09138aff] transition-all active:scale-95 flex items-center gap-2"
            >
                <LuFileText size={20} />
                <span>Generate Report</span>
            </button>

            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
            />
        </div>
    );
}