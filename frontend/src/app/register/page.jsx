"use client";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        try {
            const res = await axios.post(`${backend}/auth/register`, {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                phone: formData.phone,
            });
            setMsg(res.data.message);
            setMsgType("success");
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error) {
            setMsg(
                error.response?.data?.message || "Something went wrong. Try again."
            );
            setMsgType("error");
        }
        setLoading(false);
    }

    return (
        <>
            {/* Navbar */}
            <nav className="w-full bg-white shadow-sm px-4 md:px-20 py-3 flex items-center justify-between">

                {/* Left Logo */}
                <Image
                    src="/logo.png"
                    alt="Clinic Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                />

                {/* Right Links */}
                <div className="flex md:gap-7 gap-4 text-sm sm:text-base">
                    <Link
                        href="/"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        login
                    </Link>

                    <Link
                        href="/forget-password"
                        className="text-gray-600 hover:text-blue-600"
                    >
                        Forgot Password
                    </Link>
                </div>
            </nav>

            {/* Page Content */}
            <div className="min-h-screen bg-teal-700 flex items-center justify-center px-4">
                <div className="w-full max-w-4xl bg-white md:rounded-xl md:shadow-lg overflow-hidden flex flex-col md:flex-row">

                    {/* Register Form */}
                    <div className="w-full md:w-1/2 p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Register
                        </h2>
                        {msg && (
                            <p
                                className={`text-center text-sm mb-2 ${msgType === "success" ? "text-green-600" : "text-red-500"
                                    }`}
                            >
                                {msg}
                            </p>
                        )}
                        <form className="space-y-5" onSubmit={handleRegister}>
                            <div className="space-y-5 lg:space-y-0 lg:flex lg:gap-4">
                                {/*Full Name*/}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        required
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        name="email"
                                        className="w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    name="password"
                                    className="w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-5 lg:space-y-0 lg:flex lg:gap-4">
                                <div>
                                    {/*Phone Number*/}
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        name="phone"
                                        className="w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={handleChange}
                                        name="role"
                                        className="w-full px-4 py-3 border rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select role</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="receptionist">Receptionist</option>
                                    </select>
                                </div>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>
                    </div>
                    {/* Image – Desktop only */}
                    <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
                        <Image src="/register.png" width={400} height={300} alt="Register" />
                    </div>

                </div >
            </div >
        </>
    );
}
