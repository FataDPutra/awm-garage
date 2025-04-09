import React from "react";

export default function OrderDetailSection({ order }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Detail Pesanan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p>
                    <strong>Order ID:</strong> {order.order_id}
                </p>
                <p>
                    <strong>Customer:</strong>{" "}
                    {order.offer_price.purchase_request.user.full_name}
                </p>
                <p>
                    <strong>Service:</strong>{" "}
                    {order.offer_price.purchase_request.service.service_name}
                </p>
                <p>
                    <strong>Description:</strong>{" "}
                    {order.offer_price.purchase_request.service.description}
                </p>
                <p>
                    <strong>Total Harga:</strong> Rp{" "}
                    {order.offer_price.total_price}
                </p>
                <p>
                    <strong>Status:</strong> {order.status}
                </p>
            </div>
        </div>
    );
}
