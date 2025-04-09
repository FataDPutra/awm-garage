import React from "react";
import { Link } from "@inertiajs/react";
import { Hash, Paintbrush, FileText, Clock, User } from "lucide-react";

export default function PurchaseRequestList({
    requests,
    statusConfig,
    showCustomerColumn = false,
}) {
    return (
        <div className="space-y-6 p-6">
            {requests.length > 0 ? (
                requests.map((request, index) => {
                    const statusDisplay =
                        statusConfig[request.status] || statusConfig["all"];
                    return (
                        <div
                            key={request.id}
                            className="border rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-lg text-gray-800">
                                    #{index + 1}
                                </span>
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
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                    <Hash size={16} className="inline mr-2" />
                                    <strong>ID:</strong> {request.id}
                                </p>
                                {showCustomerColumn && (
                                    <p>
                                        <User
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        <strong>Customer:</strong>{" "}
                                        {request.user?.full_name || "N/A"}
                                    </p>
                                )}
                                <p>
                                    <Paintbrush
                                        size={16}
                                        className="inline mr-2"
                                    />
                                    <strong>Layanan:</strong>{" "}
                                    {request.service?.service_name || "N/A"}
                                </p>
                                <p className="truncate">
                                    <FileText
                                        size={16}
                                        className="inline mr-2"
                                    />
                                    <strong>Deskripsi:</strong>{" "}
                                    {request.description ||
                                        "Tidak ada deskripsi"}
                                </p>
                                <p>
                                    <Clock size={16} className="inline mr-2" />
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${statusDisplay.bgColor}`}
                                    >
                                        {statusDisplay.icon}
                                        {statusDisplay.label}
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-6 text-gray-500">
                    Belum ada pesanan dengan status ini.
                    {!showCustomerColumn && (
                        <>
                            {" "}
                            <Link
                                href={route("purchase-requests.create")}
                                className="text-blue-500 hover:underline font-semibold"
                            >
                                Buat Pesanan Sekarang!
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
