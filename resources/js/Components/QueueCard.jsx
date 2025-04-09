import React from "react";
import { Link } from "@inertiajs/react";

export default function QueueCard({ order, userRole }) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-800">
                        #{order.queue_number} - {order.order_id}
                    </p>
                    <p className="text-sm text-gray-600">{order.username}</p>
                    <p className="text-sm text-gray-600">
                        {order.service_name}
                    </p>
                </div>
                <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                >
                    {order.status}
                </span>
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
