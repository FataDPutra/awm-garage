import React from "react";
import { Link } from "@inertiajs/react";
import {
    FaHourglassStart,
    FaCheckCircle,
    FaShippingFast,
    FaUserCheck,
    FaExclamationTriangle,
    FaMoneyCheckAlt,
    FaClipboardCheck,
    FaTruck,
    FaCheck,
} from "react-icons/fa";
import { BiSolidPackage } from "react-icons/bi";

const statusConfig = {
    waiting_for_payment: {
        label: "Belum Bayar",
        icon: <FaMoneyCheckAlt className="text-base" />,
        bgColor: "bg-orange-500",
    },
    processing: {
        label: "Diproses",
        icon: <FaHourglassStart className="text-base" />,
        bgColor: "bg-yellow-500",
    },
    waiting_for_cust_confirmation: {
        label: "Menunggu Konfirmasi",
        icon: <FaUserCheck className="text-base" />,
        bgColor: "bg-blue-500",
    },
    waiting_for_customer_shipment: {
        label: "Menunggu Pengiriman Customer",
        icon: <FaShippingFast className="text-base" />,
        bgColor: "bg-indigo-500",
    },
    waiting_for_admin_confirmation: {
        label: "Menunggu Konfirmasi Admin",
        icon: <FaClipboardCheck className="text-base" />,
        bgColor: "bg-teal-500",
    },
    waiting_for_shipment: {
        label: "Menunggu Pengiriman",
        icon: <BiSolidPackage className="text-base" />,
        bgColor: "bg-purple-500",
    },
    shipped: {
        label: "Dikirim",
        icon: <FaTruck className="text-base" />,
        bgColor: "bg-cyan-500",
    },
    customer_complain: {
        label: "Komplain",
        icon: <FaExclamationTriangle className="text-base" />,
        bgColor: "bg-red-500",
    },
    approved: {
        label: "Disetujui",
        icon: <FaCheck className="text-base" />,
        bgColor: "bg-green-600",
    },
    completed: {
        label: "Selesai",
        icon: <FaCheckCircle className="text-base" />,
        bgColor: "bg-green-500",
    },
};

export default function QueueCard({ order, userRole }) {
    const currentStatus = statusConfig[order.status] || {
        label: order.status || "Unknown",
        icon: <span className="text-gray-500 text-base">?</span>,
        bgColor: "bg-gray-500",
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="truncate">
                    <p className="font-semibold text-gray-800 truncate">
                        #{order.queue_number} - {order.order_id}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                        {order.username}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                        {order.service_name}
                    </p>
                </div>
                <div
                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium self-start sm:self-auto ${currentStatus.bgColor} text-white transition-all duration-300`}
                    title={currentStatus.label}
                >
                    <span>{currentStatus.icon}</span>
                    <span className="truncate max-w-[120px]">
                        {currentStatus.label}
                    </span>
                </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
                <p>Estimasi: {order.estimated_completion}</p>
                {userRole !== "customer" && (
                    <Link
                        href={`/admin/orders/${order.order_id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs mt-1 inline-block transition-colors"
                    >
                        Lihat Detail
                    </Link>
                )}
            </div>
        </div>
    );
}
