import { useState, useEffect } from "react";
import Navbar from "../Navbar.jsx";
import ReceiptionistSidebar from "../Sidebar.jsx";
import PatientsTable from "./PatientsTable.jsx";
import BillGeneration from "./BillGeneration.jsx";
import History from "../History.jsx";
import { useSearchParams } from "next/navigation.js";
import AddPatientModal from "./AddPatientModal.jsx";

export default function ReceiptionistDashboard() {
  const [activeTab, setActiveTab] = useState("patients");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "patients";

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ReceiptionistSidebar
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Patient List</h2>

                <button
                  onClick={() => setShowAddPatient(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                >
                  + Add Patient
                </button>
              </div>

              <PatientsTable />
              {showAddPatient && (
                <AddPatientModal onClose={() => setShowAddPatient(false)} />
              )}
            </div>
          )}

          {activeTab === "billing" && (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Bill Generation</h2>
              <BillGeneration />
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