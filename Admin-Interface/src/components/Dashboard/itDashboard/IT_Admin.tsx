import { useState } from "react";
import NavBar from "../Navbar";
import IT_Stats from "./IT_Stats";
import IT_TodayAppointments from "./IT_TodayAppointments";
import IT_AppointmentManagement from "./IT_AppointmentManagement";
import ReportModal from "../common/ReportModal";
import { LuFileText } from "react-icons/lu";

export default function IT_Admin() {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20">
            <NavBar />
            <IT_Stats />
            <IT_TodayAppointments />
            <IT_AppointmentManagement />

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
    );
}