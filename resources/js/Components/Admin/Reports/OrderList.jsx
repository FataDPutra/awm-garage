import React from "react";
import { Link } from "@inertiajs/react";
import { Hash, FileText, Clock, Calendar, User } from "lucide-react";
import { statusConfig } from "@/Components/StatusSelector";

export default function OrderList({
    orders,
    linkPrefix = "/admin/orders",
    showCustomerColumn = true,
}) {
    return (
        <div className="space-y-4 p-4 sm:p-6">
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div
                        key={order.order_id}
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
                                href={`${linkPrefix}/${order.order_id}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                            >
                                Detail
                            </Link>
                        </div>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p className="flex items-center">
                                <Hash
                                    size={16}
                                    className="mr-2 text-blue-500"
                                />
                                <span>
                                    <strong>ID:</strong> {order.order_id}
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
                                        {order.offer_price?.purchase_request
                                            ?.user?.full_name ||
                                            "Tidak Diketahui"}
                                    </span>
                                </p>
                            )}
                            <p className="flex items-center">
                                <FileText
                                    size={16}
                                    className="mr-2 text-blue-500"
                                />
                                <span>
                                    <strong>Layanan:</strong>{" "}
                                    {order.offer_price?.purchase_request
                                        ?.service?.service_name ||
                                        "Tidak Diketahui"}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <Calendar
                                    size={16}
                                    className="mr-2 text-blue-500"
                                />
                                <span>
                                    <strong>Tanggal:</strong>{" "}
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <Clock
                                    size={16}
                                    className="mr-2 text-blue-500"
                                />
                                <span>
                                    <strong>Status:</strong>{" "}
                                </span>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                                        statusConfig[order.status]?.bgColor ||
                                        "bg-gray-400"
                                    }`}
                                >
                                    {statusConfig[order.status]?.icon
                                        ? React.cloneElement(
                                              statusConfig[order.status].icon,
                                              {
                                                  className: "mr-1 text-white",
                                                  size: 14,
                                              }
                                          )
                                        : null}
                                    {statusConfig[order.status]?.label ||
                                        order.status}
                                </span>
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-md">
                    Tidak ada pesanan yang ditemukan untuk filter ini.
                </div>
            )}
        </div>
    );
}
