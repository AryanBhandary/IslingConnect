import { useState } from "react";
import NavBar from "../Navbar";
import AdminSidebar, { type AdminPage } from "./AdminSidebar";
import Overview from "./pages/Overview";
import ITAppointments from "./pages/ITAppointments";
import PATAppointments from "./pages/PATAppointments";
import LostFoundRecords from "./pages/LostFoundRecords";
import SSAttendanceRecords from "./pages/SSAttendanceRecords";

export default function Admin() {
  const [activePage, setActivePage] = useState<AdminPage>("overview");

  const renderPage = () => {
    switch (activePage) {
      case "overview":         return <Overview />;
      case "ss-attendance":    return <SSAttendanceRecords />;
      case "it-appointments":  return <ITAppointments />;
      case "pat-appointments": return <PATAppointments />;
      case "lost-found":       return <LostFoundRecords />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <NavBar />
      <div className="flex">
        <AdminSidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}