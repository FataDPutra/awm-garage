import React from "react";
import { Link } from "@inertiajs/react";
import { Hash, FileText, Clock, Calendar } from "lucide-react";
import { statusConfig } from "./StatusSelector";

export default function OrderList({
    orders,
    linkPrefix = "/admin/orders",
    showCustomerColumn = true,
}) {
    return (
        <div className="space-y-6 p-6">
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div
                        key={order.order_id}
                        className="border rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-lg text-gray-800">
                                #{index + 1}
                            </span>
                            <Link
                                href={`${linkPrefix}/${order.order_id}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm shadow"
                            >
                                Detail
                            </Link>
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>
                                <Hash
                                    size={16}
                                    className="inline mr-2 text-white md:text-gray-600"
                                />
                                <strong>ID:</strong> {order.order_id}
                            </p>
                            {showCustomerColumn && (
                                <p>
                                    <FileText
                                        size={16}
                                        className="inline mr-2 text-white md:text-gray-600"
                                    />
                                    <strong>Customer:</strong>{" "}
                                    {order.offer_price?.purchase_request?.user
                                        ?.full_name || "Tidak Diketahui"}
                                </p>
                            )}
                            <p className="truncate">
                                <FileText
                                    size={16}
                                    className="inline mr-2 text-white md:text-gray-600"
                                />
                                <strong>Layanan:</strong>{" "}
                                {order.offer_price?.purchase_request?.service
                                    ?.service_name || "Tidak Diketahui"}
                            </p>
                            <p>
                                <Calendar
                                    size={16}
                                    className="inline mr-2 text-white md:text-gray-600"
                                />
                                <strong>Tanggal:</strong>{" "}
                                {new Date(order.created_at).toLocaleDateString(
                                    "id-ID",
                                    {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                            <p>
                                <Clock
                                    size={16}
                                    className="inline mr-2 text-white md:text-gray-600"
                                />
                                <strong>Status:</strong>{" "}
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
                                                  className: "mr-1",
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
                <div className="text-center py-6 text-gray-500">
                    Tidak ada pesanan yang ditemukan untuk filter ini.
                </div>
            )}
        </div>
    );
}
