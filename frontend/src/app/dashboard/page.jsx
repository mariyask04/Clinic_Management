"use client";

import { useEffect, useState } from "react";
import DoctorDashboard from "@/components/Doctor/DoctorDashboard";
import ReceiptionistDashboard from "@/components/Receiptionist/ReceiptionistDashboard";

export default function DashboardPage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  if (!role) return <p>Loading...</p>;

  return (
    <div>
      {role === "doctor" && <DoctorDashboard />}
      {role === "receptionist" && <ReceiptionistDashboard />}
    </div>
  );
}
