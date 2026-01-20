import { useState, useEffect } from "react";
import Navbar from "../Navbar.jsx";
import PatientsTable from "../Doctor/PatientsTable.jsx";
import History from "../History.jsx";
import { useSearchParams } from "next/navigation.js";
import Sidebar from "../Sidebar.jsx";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("patients");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "patients";

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Content */}
        <main className="p-4 md:p-6 bg-gray-50 flex-1 overflow-y-auto">
          {activeTab === "patients" && (
            <div className="max-w-7xl mx-auto">

              <PatientsTable />
            </div>
          )}

          {activeTab === "history" && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">History of patients</h2>
              <History />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}