import NavBar from "../Navbar";
import LF_Stats from "./LF_Stats";
import LF_ItemManagement from "./LF_ItemManagement";

export default function LF_Admin() {
    return (
        <div className="bg-[#FAFAFA] min-h-screen">
            <NavBar />
            <LF_Stats />
            <LF_ItemManagement />
        </div>
    );
}