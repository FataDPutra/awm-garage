import React from "react";
import { Link } from "@inertiajs/react";
import { Hash, Paintbrush, FileText, Clock, User } from "lucide-react";

export default function PurchaseRequestList({
    requests,
    statusConfig,
    showCustomerColumn = false,
}) {
    return (
        <div className="space-y-4 p-4 sm:p-6">
            {requests.length > 0 ? (
                requests.map((request, index) => {
                    const statusDisplay =
                        statusConfig[request.status] || statusConfig["all"];
                    return (
                        <div
                            key={request.id}
                            className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-lg text-gray-800 flex items-center">
                                    <Hash
                                        size={16}
                                        className="mr-2 text-blue-500"
                                    />
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
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                                >
                                    Lihat
                                </Link>
                            </div>
                            <div className="space-y-3 text-sm text-gray-700">
                                <p className="flex items-center">
                                    <Hash
                                        size={16}
                                        className="mr-2 text-blue-500"
                                    />
                                    <span>
                                        <strong>ID:</strong> {request.id}
                                    </span>
                                </p>
                                {showCustomerColumn && (
                                    <p className="flex items-center">
                                        <User
                                            size={16}
                                            className="mr-2 text-blue-500"
                                        />
                                        <span>
                                            <strong>Customer:</strong>{" "}
                                            {request.user?.full_name || "N/A"}
                                        </span>
                                    </p>
                                )}
                                <p className="flex items-center">
                                    <Paintbrush
                                        size={16}
                                        className="mr-2 text-blue-500"
                                    />
                                    <span>
                                        <strong>Layanan:</strong>{" "}
                                        {request.service?.service_name || "N/A"}
                                    </span>
                                </p>
                                <p className="flex items-start">
                                    <FileText
                                        size={16}
                                        className="mr-2 text-blue-500 mt-1"
                                    />
                                    <span>
                                        <strong>Deskripsi:</strong>{" "}
                                        {request.description ||
                                            "Tidak ada deskripsi"}
                                    </span>
                                </p>
                                <p className="flex items-center">
                                    <Clock
                                        size={16}
                                        className="mr-2 text-blue-500"
                                    />
                                    <span>
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${statusDisplay.bgColor}`}
                                        >
                                            {React.cloneElement(
                                                statusDisplay.icon,
                                                {
                                                    className:
                                                        "mr-1 text-white",
                                                    size: 14,
                                                }
                                            )}
                                            {statusDisplay.label}
                                        </span>
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-8 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-md">
                    Belum ada pesanan dengan status ini.
                    {!showCustomerColumn && (
                        <Link
                            href={route("purchase-requests.create")}
                            className="text-blue-500 hover:underline font-semibold ml-1"
                        >
                            Buat Pesanan Sekarang!
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
