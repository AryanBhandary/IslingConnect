import { useState } from "react";
import NavBar from "../Navbar";
import PAT_Stats from "./PAT_Stats";
import PAT_TodayAppointments from "./PAT_TodayAppointments";
import PAT_AppointmentManagement from "./PAT_AppointmentManagement";
import ReportModal from "../common/ReportModal";
import { LuFileText } from "react-icons/lu";

export default function PAT_Admin() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            <NavBar />
            <PAT_Stats />
            <PAT_TodayAppointments />
            <PAT_AppointmentManagement />

            {/* Floating Report Button */}
            <button
                onClick={() => setIsReportModalOpen(true)}
                className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 z-[100] bg-[#1D289C] text-white font-bold py-2.5 px-4 sm:py-3 sm:px-8 rounded-full shadow-2xl hover:bg-[#09138aff] transition-all active:scale-95 flex items-center gap-2"
            >
                <LuFileText size={20} />
                <span className="hidden sm:inline">Generate Report</span>
            </button>

            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
            />
        </div>
    );
}