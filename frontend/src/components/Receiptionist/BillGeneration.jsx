"use client";

import { Search, User, Calendar, Hash, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import BillModal from "./BillModal.jsx";
import axios from "axios";

export default function BillGeneration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  useEffect(() => {
    fetchPatients();
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${backend}/patient/completed`);

      if (res.data.success) {
        setPatients(res.data.patients);
      }
    } catch (error) {
      console.log("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();
    return (
      patient.fullName.toLowerCase().includes(search) ||
      patient.tokenNumber.includes(search) ||
      patient.visitDate.includes(search)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, token number, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {patient.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{patient.visitDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-mono">
                          {patient.tokenNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!patient.billGenerated ? (
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Generate Bill
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">Bill Generated ✓</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No completed patients found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredPatients.length} of {patients.length} completed patients
      </div>

      {/* Bill Modal */}
      {selectedPatient && (
        <BillModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}