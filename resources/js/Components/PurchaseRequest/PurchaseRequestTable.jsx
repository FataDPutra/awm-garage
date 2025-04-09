import React from "react";
import { Link } from "@inertiajs/react";
import { Hash, Paintbrush, FileText, Clock, Send, User } from "lucide-react";

export default function PurchaseRequestTable({
    requests,
    statusConfig,
    showCustomerColumn = false,
}) {
    return (
        <table className="w-full text-left border-collapse">
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
                                <User size={18} className="mr-2" /> Customer
                            </div>
                        </th>
                    )}
                    <th className="p-4 font-semibold border-b">
                        <div className="flex items-center">
                            <Paintbrush size={18} className="mr-2" /> Layanan
                        </div>
                    </th>
                    <th className="p-4 font-semibold border-b">
                        <div className="flex items-center">
                            <FileText size={18} className="mr-2" /> Permintaan
                        </div>
                    </th>
                    <th className="p-4 font-semibold border-b">
                        <div className="flex items-center">
                            <Clock size={18} className="mr-2" /> Status
                        </div>
                    </th>
                    <th className="p-4 font-semibold border-b">
                        <div className="flex items-center">
                            <Send size={18} className="mr-2" /> Aksi
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {requests.length > 0 ? (
                    requests.map((request, index) => {
                        const statusDisplay =
                            statusConfig[request.status] || statusConfig["all"];
                        return (
                            <tr
                                key={request.id}
                                className="border-b hover:bg-gray-50 transition-all duration-200"
                            >
                                <td className="p-4">{index + 1}</td>
                                <td className="p-4 font-medium text-gray-800">
                                    {request.id}
                                </td>
                                {showCustomerColumn && (
                                    <td className="p-4">
                                        {request.user?.full_name || "N/A"}
                                    </td>
                                )}
                                <td className="p-4">
                                    {request.service?.service_name || "N/A"}
                                </td>
                                <td className="p-4 truncate max-w-xs text-gray-600">
                                    {request.description ||
                                        "Tidak ada deskripsi"}
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${statusDisplay.bgColor}`}
                                    >
                                        {statusDisplay.icon && (
                                            <span className="mr-2">
                                                {React.cloneElement(
                                                    statusDisplay.icon,
                                                    {
                                                        className: "text-white",
                                                    }
                                                )}
                                            </span>
                                        )}
                                        <span>{statusDisplay.label}</span>
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link
                                        href={
                                            showCustomerColumn
                                                ? route(
                                                      "admin.purchaserequests.show",
                                                      request.id
                                                  )
                                                : route(
                                                      "purchase_requests.show",
                                                      request.id
                                                  )
                                        }
                                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm shadow"
                                    >
                                        Lihat
                                    </Link>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td
                            colSpan={showCustomerColumn ? 7 : 6}
                            className="p-6 text-center text-gray-500"
                        >
                            Belum ada pesanan dengan status ini.
                            {!showCustomerColumn && (
                                <>
                                    {" "}
                                    <Link
                                        href={route("purchase-requests.create")}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Buat sekarang!
                                    </Link>
                                </>
                            )}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
