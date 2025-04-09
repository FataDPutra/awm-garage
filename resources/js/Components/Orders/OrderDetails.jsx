import React from "react";

export default function OrderDetails({ order }) {
    const customer = order.offer_price.purchase_request.user;
    const service = order.offer_price.purchase_request.service;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-200">
                Informasi Pesanan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        <strong className="font-semibold text-gray-800">
                            Order ID:
                        </strong>{" "}
                        <span className="text-blue-600 font-medium">
                            #{order.order_id}
                        </span>
                    </p>
                    <p className="text-gray-600">
                        <strong className="font-semibold text-gray-800">
                            Customer:
                        </strong>{" "}
                        {customer.full_name}{" "}
                        <span className="text-gray-500">
                            ({customer.phone})
                        </span>
                    </p>
                    <p className="text-gray-600">
                        <strong className="font-semibold text-gray-800">
                            Layanan:
                        </strong>{" "}
                        <span className="text-indigo-600 font-medium">
                            {service.service_name}
                        </span>
                    </p>
                    <p className="text-gray-600">
                        <strong className="font-semibold text-gray-800">
                            Tanggal Pesan:
                        </strong>{" "}
                        {new Date(order.created_at).toLocaleDateString(
                            "id-ID",
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </p>
                </div>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        <strong className="font-semibold text-gray-800">
                            Total Harga:
                        </strong>{" "}
                        <span className="text-green-600 text-lg font-semibold">
                            Rp {order.offer_price.total_price.toLocaleString()}
                        </span>
                    </p>
                    <p className="text-gray-600">
                        <strong className="font-semibold text-gray-800">
                            Status:
                        </strong>{" "}
                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize shadow-sm">
                            {order.status.replace("_", " ")}
                        </span>
                    </p>
                    <p className="text-gray-600">
                        <strong className="font-semibold text-gray-800">
                            Konfirmasi Customer:
                        </strong>{" "}
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                order.customer_confirmation === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : order.customer_confirmation === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                            } shadow-sm`}
                        >
                            {order.customer_confirmation || "Pending"}
                        </span>
                    </p>
                </div>
            </div>
            {order.completed_photo_path && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Hasil Pengerjaan
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {(Array.isArray(order.completed_photo_path)
                            ? order.completed_photo_path
                            : [order.completed_photo_path]
                        ).map((photo, index) => (
                            <img
                                key={index}
                                src={`/storage/${photo}`}
                                alt={`Completed ${index}`}
                                className="w-full h-40 object-cover rounded-lg shadow-md border-2 border-gray-100 transform transition-all hover:scale-105 cursor-pointer"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
