"use client";

import { Menu, X, User, LogOut, Link } from "lucide-react";
import { useRouter } from "next/navigation";

function Navbar({ onMenuClick }) {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/");
    };

    return (
        <div className="h-16 bg-white border-b border-teal-800 px-4 md:px-6 flex justify-between items-center sticky top-0 z-10">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden md:block flex-1"></div>

            <div className="flex items-center gap-3 md:gap-5">
                {/* Profile Icon */}
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-400 transition-colors hover:cursor-pointer" onClick={() => router.push("/profile")}>
                    <User className="w-5 h-5 text-teal-700" />
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 font-medium hover:text-red-700 hover:cursor-pointer transition-colors"
                >
                    <span className="hidden sm:inline">Logout</span>
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default Navbar;