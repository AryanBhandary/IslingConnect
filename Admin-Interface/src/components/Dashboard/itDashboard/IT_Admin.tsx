import NavBar from "../Navbar";
import IT_Stats from "./IT_Stats";
import IT_TodayAppointments from "./IT_TodayAppointments";
import IT_AppointmentManagement from "./IT_AppointmentManagement";

export default function IT_Admin() {
    return (
        <div className="bg-[#FAFAFA] min-h-screen">
            <NavBar />
            <IT_Stats />
            <IT_TodayAppointments />
            <IT_AppointmentManagement />
        </div>
    );
}