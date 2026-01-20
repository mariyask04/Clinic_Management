import { Search, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function PatientsTable() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [role, setRole] = useState("");
    const router = useRouter();

    const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        setRole(userRole);
    }, []);

    useEffect(() => {
        fetchTodayWaitingPatients();
    }, []);

    const fetchTodayWaitingPatients = async () => {
        try {
            const res = await axios.get(`${backend}/patient/waiting`)
            setPatients(res.data.patients || []);
        } catch (error) {
            console.error("Fetch Patients Error:", error);
        }
    };

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm) ||
            patient.tokenNumber.includes(searchTerm);

        return matchesSearch;
    });

    const handleViewPatient = (patientId) => {
        router.push(`/patient/${patientId}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, phone, or token number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Full Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
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
                                            <div className="text-sm font-medium text-gray-900">
                                                {patient.fullName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{patient.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{patient.visitDate}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 font-mono">
                                                {patient.tokenNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewPatient(patient.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No patients found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-sm text-gray-600">
                Showing {filteredPatients.length} of {patients.length} patients
            </div>
        </div>
    );
}

export default PatientsTable;