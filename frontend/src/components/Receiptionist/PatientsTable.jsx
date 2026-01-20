import { Search, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function PatientsTable() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [role, setRole] = useState("");
    const router = useRouter();

    const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        setRole(userRole);
    }, []);

    useEffect(() => {
        fetchTodayPatients();
    }, []);

    const fetchTodayPatients = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${backend}/patient/today`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                });
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

        const matchesStatus =
            statusFilter === "all" || patient.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewPatient = (patientId) => {
        router.push(`/patient/${patientId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "waiting":
                return "bg-yellow-100 text-yellow-800";
            case "in_consultation":
                return "bg-green-100 text-green-800";
            case "completed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const handleAssignToken = async (patientId) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(
                `${backend}/receptionist/assign-token/${patientId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(`Token Assigned: ${res.data.token.tokenNumber}`);
            fetchTodayPatients();

        } catch (error) {
            console.error("Token Assign Error:", error);
            alert("Failed to assign token");
        }
    };

    const handleUpdateStatus = async (tokenId, newStatus) => {
        try {
            const res = await axios.put(`${backend}/patient/status/${tokenId}`, {
                status: newStatus,
            });

            console.log(res.data);
            // refresh list etc.
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="in_consultation">In Consultation</option>
                    <option value="waiting">Waiting</option>
                    <option value="completed">Completed</option>
                </select>
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
                                    Status
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
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                    patient.status
                                                )}`}
                                            >
                                                {patient.status}
                                            </span>
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

                                            {/* Show Assign Token only if token is NOT available */}
                                            {patient.tokenNumber === "-" &&  (
                                                <button
                                                    onClick={() => handleAssignToken(patient.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    Assign Token
                                                </button>
                                            )}
                                            {/* Update Status → In Consultation (Only for Receptionist) */}
                                            {patient.tokenNumber !== "-" &&
                                                patient.status === "waiting" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(patient.tokenId, "in_consultation")}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                                    >
                                                        Update Status
                                                    </button>
                                                )}
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