import { Link, usePage } from "@inertiajs/react";
import React from "react";

export default function CustomerIndex() {
    const { orders } = usePage().props;
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Daftar Pesanan Anda</h1>
            <div className="bg-white shadow rounded-lg p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Total Harga</th>
                            <th className="p-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id} className="border-t">
                                <td className="p-3">{order.order_id}</td>
                                <td className="p-3">{order.status}</td>
                                <td className="p-3">
                                    Rp {order.offer_price.total_price}
                                </td>
                                <td className="p-3">
                                    <Link
                                        href={`/orders/${order.order_id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Lihat Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
