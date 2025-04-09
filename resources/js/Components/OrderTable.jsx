import React from "react";
import { Link } from "@inertiajs/react";
import { Hash, Package, FileText, Clock, Truck } from "lucide-react";
import {
    FaHourglassStart,
    FaCheckCircle,
    FaShippingFast,
    FaUserCheck,
    FaTimesCircle,
    FaExclamationTriangle,
    FaMoneyCheckAlt,
    FaClipboardCheck,
} from "react-icons/fa";

// Definisikan statusConfig langsung di dalam OrderTable
const statusConfig = {
    waiting_for_payment: {
        label: "Belum Bayar",
        icon: <FaMoneyCheckAlt className="text-white" />,
        bgColor: "bg-orange-500",
    },
    processing: {
        label: "Diproses",
        icon: <FaHourglassStart className="text-white" />,
        bgColor: "bg-yellow-500",
    },
    waiting_for_cust_confirmation: {
        label: "Menunggu Konfirmasi",
        icon: <FaUserCheck className="text-white" />,
        bgColor: "bg-blue-500",
    },
    waiting_for_shipment: {
        label: "Dikirim",
        icon: <FaShippingFast className="text-white" />,
        bgColor: "bg-purple-500",
    },
    waiting_for_admin_confirmation: {
        label: "Menunggu Konfirmasi Admin",
        icon: <FaClipboardCheck className="text-white" />,
        bgColor: "bg-teal-500",
    },
    customer_complain: {
        label: "Komplain",
        icon: <FaExclamationTriangle className="text-white" />,
        bgColor: "bg-red-500",
    },
    completed: {
        label: "Selesai",
        icon: <FaCheckCircle className="text-white" />,
        bgColor: "bg-green-500",
    },
    cancelled: {
        label: "Dibatalkan",
        icon: <FaTimesCircle className="text-white" />,
        bgColor: "bg-gray-500",
    },
};

export default function OrderTable({
    orders,
    linkPrefix = "/admin/orders",
    showCustomerColumn = true,
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
                <colgroup>
                    <col className="w-[5%]" />
                    <col className="w-[20%]" />
                    {showCustomerColumn && <col className="w-[20%]" />}
                    <col className={showCustomerColumn ? "w-[20%" : "w-[25%"} />

                    <col
                        className={
                            showCustomerColumn
                                ? "md:w-[25%] w-[20%"
                                : "md:w-[35%] w-[25%"
                        }
                    />

                    <col className={showCustomerColumn ? "w-[10%" : "w-[15%"} />
                </colgroup>
                <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                        <th className="p-4 font-semibold border-b">
                            <div className="flex items-center">
                                <Hash size={18} className="mr-2" /> No
                            </div>
                        </th>
                        <th className="p-4 font-semibold border-b">
                            <div className="flex items-center">
                                <Hash size={18} className="mr-2" /> ID Pesanan
                            </div>
                        </th>
                        {showCustomerColumn && (
                            <th className="p-4 font-semibold border-b">
                                <div className="flex items-center">
                                    <Package size={18} className="mr-2" />{" "}
                                    Customer
                                </div>
                            </th>
                        )}
                        <th className="p-4 font-semibold border-b">
                            <div className="flex items-center">
                                <FileText size={18} className="mr-2" /> Layanan
                            </div>
                        </th>
                        <th className="p-4 font-semibold border-b">
                            <div className="flex items-center">
                                <Clock size={18} className="mr-2" /> Status
                            </div>
                        </th>
                        <th className="p-4 font-semibold border-b">
                            <div className="flex items-center">
                                <Truck size={18} className="mr-2" /> Aksi
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr
                                key={order.order_id}
                                className="border-b hover:bg-gray-50 transition-all duration-200"
                            >
                                <td className="p-4 truncate">{index + 1}</td>
                                <td className="p-4 font-medium text-gray-800 truncate">
                                    {order.order_id}
                                </td>
                                {showCustomerColumn && (
                                    <td className="p-4 truncate">
                                        {order.offer_price?.purchase_request
                                            ?.user?.full_name || "N/A"}
                                    </td>
                                )}
                                <td className="p-4 truncate text-gray-600">
                                    {order.offer_price?.purchase_request
                                        ?.service?.service_name || "N/A"}
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                                            statusConfig[order.status]
                                                ?.bgColor || "bg-gray-400"
                                        }`}
                                    >
                                        {statusConfig[order.status]?.icon && (
                                            <span className="mr-2">
                                                {
                                                    statusConfig[order.status]
                                                        .icon
                                                }
                                            </span>
                                        )}
                                        <span>
                                            {statusConfig[order.status]
                                                ?.label || order.status}
                                        </span>
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link
                                        href={`${linkPrefix}/${order.order_id}`}
                                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm shadow"
                                    >
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={showCustomerColumn ? 6 : 5}
                                className="p-6 text-center text-gray-500"
                            >
                                Belum ada pesanan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
