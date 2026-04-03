import NavBar from "../Navbar";
import AttendanceRequests from "./AttendanceRequests";

export default function SS_Admin() {
    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <AttendanceRequests />
        </div>
    )
}