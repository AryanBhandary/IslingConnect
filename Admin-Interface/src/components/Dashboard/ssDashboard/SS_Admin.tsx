import NavBar from "../Navbar";
import SS_Stats from "./SS_Stats";
import AttendanceRequests from "./AttendanceRequests";

export default function SS_Admin() {
    return (
        <div className="bg-[#FAFAFA] min-h-screen">
            <NavBar />
            <SS_Stats />
            <AttendanceRequests />
        </div>
    )
}