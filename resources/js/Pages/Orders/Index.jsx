import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Index() {
    const { orders } = usePage().props;

    return (
        <div className="p-6 bg-white shadow rounded">
            <h2 className="text-lg font-bold mb-4">Daftar Pesanan</h2>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Order ID</th>
                        <th className="border p-2">Customer</th>
                        <th className="border p-2">Service</th>
                        <th className="border p-2">Total Harga</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id} className="border">
                            <td className="border p-2">{order.order_id}</td>
                            <td className="border p-2">
                                {
                                    order.offer_price.purchase_request.user
                                        .full_name
                                }
                            </td>
                            <td className="border p-2">
                                {
                                    order.offer_price.purchase_request.service
                                        .service_name
                                }
                            </td>
                            <td className="border p-2">
                                Rp {order.offer_price.total_price}
                            </td>
                            <td className="border p-2">
                                <span className="px-2 py-1 rounded text-white text-sm bg-blue-500">
                                    {order.status}
                                </span>
                            </td>
                            <td className="border p-2">
                                <Link
                                    href={`/admin/orders/${order.order_id}`}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Lihat Detail
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
