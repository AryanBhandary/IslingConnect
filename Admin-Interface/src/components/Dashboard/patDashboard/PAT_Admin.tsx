import NavBar from "../Navbar";
import PAT_Stats from "./PAT_Stats";
import PAT_TodayAppointments from "./PAT_TodayAppointments";
import PAT_AppointmentManagement from "./PAT_AppointmentManagement";

export default function PAT_Admin() {
    return (
        <div className="bg-[#FAFAFA] min-h-screen">
            <NavBar />
            <PAT_Stats />
            <PAT_TodayAppointments />
            <PAT_AppointmentManagement />
        </div>
    );
}