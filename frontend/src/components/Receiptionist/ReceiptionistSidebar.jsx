import { X, Users, DollarSign, History } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ReceiptionistSidebar({ activeTab, onClose, isMobileOpen }) {
    const navItems = [
        { id: "patients", label: "Patients List", Icon: Users },
        { id: "billing", label: "Bill Generation", Icon: DollarSign },
        { id: "history", label: "History", Icon: History }
    ];

    const router = useRouter();

    const handleNavClick = (tabId) => {
        router.push(`/dashboard?tab=${tabId}`);
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-teal-700 h-screen p-5 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
            >
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Logo */}
                <div className="mb-20 mt-10 flex items-center justify-center">
                    <Image src="/logo.png" alt="Clinic Logo" width={120} height={120} />
                </div>

                {/* Sidebar Links */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const IconComponent = item.Icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`
                  py-3 px-4 rounded-lg font-medium text-left flex items-center gap-3
                  transition-all duration-200
                  ${activeTab === item.id
                                        ? "bg-gray-400 text-white shadow-md"
                                        : "text-gray-300 hover:bg-gray-100 hover:text-teal-700"
                                    }
                `}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}

export default ReceiptionistSidebar;