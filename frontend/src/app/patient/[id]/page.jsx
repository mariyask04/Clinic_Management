"use client";

import { use, useState, useEffect } from "react";
import {
    Mail, Phone, Calendar, MapPin, Hash,
    FileText, Pill, DollarSign, Clock, ArrowLeft,
    Stethoscope, CreditCard, Activity, Plus
} from "lucide-react";
import axios from "axios";
import AddPrescriptionModal from "@/components/Doctor/AddPrescriptionModal";

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PatientDetailPage({ params }) {
    const { id: patientId } = use(params);
    const [loading, setLoading] = useState(true);
    const [patientData, setPatientData] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [selectedTokenId, setSelectedTokenId] = useState(null);

    const [role, setRole] = useState("");

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        setRole(userRole);
    }, []);

    const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const fetchPatientData = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${backend}/patient/full-details/${patientId}`);

            if (response.data.success) {
                setPatientData({
                    patient: response.data.patient,
                    tokens: response.data.tokens,
                    prescriptions: response.data.prescriptions,
                    bills: response.data.bills
                });
            } else {
                setPatientData(null);
            }

        } catch (error) {
            console.error("Error fetching patient data:", error);
            setPatientData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientData();
    }, [patientId]);

    const handleUpdateStatus = async (tokenId) => {
        try {
            const response = await axios.put(
                `${backend}/patient/status/${tokenId}`,
                { status: "completed" }
            );

            alert("Status updated to Completed!");
            fetchPatientData(); // refresh UI
        } catch (error) {
            console.error("Status update failed:", error);
            alert(error.response?.data?.message || "Something went wrong");
        }
    };

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!patientData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Not Found</h2>
                    <p className="text-gray-600">The patient you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const { patient, tokens, prescriptions, bills } = patientData;
    const latestToken = tokens?.[0] || null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
                            <p className="text-sm text-gray-600">Complete medical history and records</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Patient Info Card */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-linear-to-r from-gray-500 to-gray-600 px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-teal-600 text-2xl font-bold shadow-lg">
                                {patient.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-white">
                                <h2 className="text-3xl font-bold">{patient.fullName}</h2>
                                <p className="text-gray-100 mt-1 capitalize">{patient.gender} • {patient.age} years old</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <p className="text-sm text-gray-900 mt-1">{patient.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                                    <p className="text-sm text-gray-900 mt-1">{patient.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Registered On</p>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {new Date(patient.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Address</p>
                                    <p className="text-sm text-gray-900 mt-1 line-clamp-2">{patient.address}</p>
                                </div>
                            </div>
                        </div>
                        {role === "doctor" && latestToken?.status !== "completed" && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => handleUpdateStatus(latestToken._id)}
                                    className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 transition"
                                >
                                    Mark as Completed
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Visits</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{tokens.length}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <Activity className="w-8 h-8 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Prescriptions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{prescriptions.length}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <FileText className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Spent</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    ₹{bills.reduce((sum, bill) => sum + bill.totalAmount, 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <DollarSign className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "overview"
                                    ? "text-gray-600 border-b-2 border-gray-600 bg-gray-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Overview
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("prescriptions")}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "prescriptions"
                                    ? "text-gray-600 border-b-2 border-gray-600 bg-gray-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Pill className="w-4 h-4" />
                                    Prescriptions
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("bills")}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === "bills"
                                    ? "text-gray-600 border-b-2 border-gray-600 bg-gray-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Bills
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Recent Visits
                                </h3>
                                <div className="space-y-4">
                                    {tokens.map((token) => (
                                        <div key={token._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-gray-50 rounded-lg">
                                                        <Hash className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{token.tokenNumber}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(token.visitDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${token.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : token.status === "in_consultation"
                                                        ? "bg-gray-100 text-gray-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                    {(token.status || '').replace('_', ' ').toUpperCase()}                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Prescriptions Tab */}
                        {activeTab === "prescriptions" && (
                            <div className="space-y-6">
                                {/* Add Prescription Button - Only for Doctors */}
                                {role === "doctor" && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                const latestTokenId = tokens?.[0]?._id;
                                                setSelectedTokenId(latestTokenId);
                                                setShowPrescriptionModal(true);
                                            }}
                                            className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 transition flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Prescription
                                        </button>
                                    </div>
                                )}

                                {prescriptions.length > 0 ? (
                                    prescriptions.map((prescription) => (
                                        <div key={prescription._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Hash className="w-4 h-4 text-gray-500" />
                                                        <span className="font-semibold text-gray-900">{prescription.tokenNumber}</span>
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <Stethoscope className="w-5 h-5 text-blue-600 mt-1" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Doctor</p>
                                                        <p className="text-gray-900">{prescription.doctor.name}</p>
                                                        <p className="text-sm text-gray-600">{prescription.doctor.specialization}</p>
                                                    </div>
                                                </div>

                                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                                                    <p className="text-sm font-medium text-yellow-900 mb-1">Diagnosis</p>
                                                    <p className="text-yellow-800">{prescription.diagnosis}</p>
                                                </div>

                                                {prescription.medicines.length > 0 && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                                            <Pill className="w-4 h-4" />
                                                            Medicines
                                                        </p>
                                                        <div className="space-y-2">
                                                            {prescription.medicines.map((medicine, idx) => (
                                                                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                                                                    <p className="font-semibold text-gray-900">{medicine.name}</p>
                                                                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                                                                        <div>
                                                                            <span className="text-xs text-gray-500">Dosage:</span>
                                                                            <p>{medicine.dosage}</p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-xs text-gray-500">Frequency:</span>
                                                                            <p>{medicine.frequency}</p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-xs text-gray-500">Duration:</span>
                                                                            <p>{medicine.duration}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {prescription.advice && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <p className="text-sm font-medium text-blue-900 mb-1">Doctor's Advice</p>
                                                        <p className="text-sm text-blue-800">{prescription.advice}</p>
                                                    </div>
                                                )}

                                                {prescription.followUpDate && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-600">Follow-up Date:</span>
                                                        <span className="font-medium text-gray-900">
                                                            {new Date(prescription.followUpDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No prescriptions found</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Add Prescription Modal (GLOBAL LEVEL) */}
                        {showPrescriptionModal && (
                            <AddPrescriptionModal
                                patient={patientData}
                                tokenId={selectedTokenId}
                                onClose={() => setShowPrescriptionModal(false)}
                                onSave={(formData) => {
                                    console.log("Saved prescription:", formData);
                                    setShowPrescriptionModal(false);
                                }}
                            />
                        )}

                        {/* Bills Tab */}
                        {activeTab === "bills" && (
                            <div className="space-y-6">
                                {bills.length > 0 ? (
                                    bills.map((bill) => (
                                        <div key={bill._id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Hash className="w-4 h-4 text-gray-500" />
                                                        <span className="font-semibold text-gray-900">{bill.token}</span>
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(bill.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                        Paid
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <table className="w-full">
                                                    <tbody className="text-sm">
                                                        {bill.items.map((item, idx) => (
                                                            <tr key={idx} className="border-b border-gray-100">
                                                                <td className="py-2 text-gray-600">{item.description}</td>
                                                                <td className="py-2 text-right font-medium text-gray-900">₹{item.amount}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="bg-gray-50">
                                                            <td className="py-3 text-gray-900 font-semibold">Total Amount</td>
                                                            <td className="py-3 text-right text-lg font-bold text-gray-900">₹{bill.totalAmount}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No bills found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}