"use client";

import Navbar from "@/components/Navbar";
import { User, Mail, Phone, Briefcase, Edit2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
    });

    const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    useEffect(() => {
        setRole(localStorage.getItem("role"));

        fetchProfile();
    }, []);

    // -------------------------
    // Fetch Profile From Backend
    // -------------------------
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${backend}/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setForm(res.data.user);
        } catch (error) {
            console.error("Profile Fetch Error:", error);
            alert("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `${backend}/auth/profile/update`,
                {
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Profile updated successfully!");
            setEditing(false);
        } catch (error) {
            console.error("Profile Update Error:", error);
            alert("Failed to update profile.");
        }
    };

    const handleCancel = () => {
        fetchProfile(); // reload original data
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-xl">
                Loading Profile...
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activeTab="profile"
                isMobileOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                            <p className="text-sm text-gray-600 mt-1">Manage your personal information</p>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-gray-600 px-6 py-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-teal-700 text-2xl font-bold shadow-lg">
                                        {form.fullName ? form.fullName.split(' ').map(n => n[0]).join('') : ""}
                                    </div>
                                    <div className="text-white">
                                        <h3 className="text-2xl font-bold">{form.fullName}</h3>
                                        <p className="text-blue-100 mt-1 capitalize">{form.role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Full Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                Full Name
                                            </div>
                                        </label>
                                        <input
                                            disabled={!editing}
                                            type="text"
                                            value={form.fullName}
                                            onChange={(e) =>
                                                setForm({ ...form, fullName: e.target.value })
                                            }
                                            className="w-full px-4 py-2.5 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                Email Address
                                            </div>
                                        </label>
                                        <input
                                            disabled={!editing}
                                            type="email"
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm({ ...form, email: e.target.value })
                                            }
                                            className="w-full px-4 py-2.5 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                Phone Number
                                            </div>
                                        </label>
                                        <input
                                            disabled={!editing}
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) =>
                                                setForm({ ...form, phone: e.target.value })
                                            }
                                            className="w-full px-4 py-2.5 border rounded-lg disabled:bg-gray-50"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-gray-500" />
                                                Role
                                            </div>
                                        </label>
                                        <input
                                            disabled
                                            type="text"
                                            value={form.role}
                                            className="w-full px-4 py-2.5 border rounded-lg bg-gray-50"
                                        />
                                        <p className="text-gray-700">Role cannot be changed.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="px-6 py-4 bg-gray-50 border-t">
                                {editing ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg"
                                        >
                                            <Save className="w-4 h-4 inline" /> Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg"
                                        >
                                            <X className="w-4 h-4 inline" /> Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg"
                                        >
                                            <Edit2 className="w-4 h-4 inline" /> Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
