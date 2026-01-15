"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const backend = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  // STEP 1 - Send OTP to Email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${backend}/auth/send-otp`, { email });
      alert(res.data.message);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  // STEP 2 - Verify OTP (just moves to next step)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setStep(3);
  };

  // STEP 3 - Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${backend}/auth/reset-password`, {
        email,
        otp,
        newPassword: password,
      });

      alert(res.data.message);
      router.push("/");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm px-4 md:px-20 py-3 flex items-center justify-between">
        <Image src="/logo.png" alt="Clinic Logo" width={100} height={100} />

        <div className="flex md:gap-7 gap-4 text-sm sm:text-base">
          <Link href="/" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <div className="min-h-screen bg-teal-700 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-white md:rounded-xl md:shadow-lg overflow-hidden flex flex-col md:flex-row">

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Forgot Password
            </h2>

            {/* STEP 1 – EMAIL */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* STEP 2 – OTP */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                  Verify OTP
                </button>
              </form>
            )}

            {/* STEP 3 – RESET PASSWORD */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>

          {/* Image Section */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
            <Image src="/forget-password.png" width={500} height={400} alt="Forgot Password" />
          </div>

        </div>
      </div>
    </>
  );
}
