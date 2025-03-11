import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({ auth, orders }) {
    const [queue, setQueue] = useState([]);

    // Fungsi untuk menghitung estimasi selesai (tetap sama)
    const calculateEstimatedCompletion = (
        createdAt,
        shippingDaysToAdmin,
        estimationDays
    ) => {
        const startDate = new Date(createdAt);
        let estimatedDate = new Date(startDate);
        let totalDaysToAdd = (shippingDaysToAdmin || 2) + (estimationDays || 3);

        while (totalDaysToAdd > 0) {
            estimatedDate.setDate(estimatedDate.getDate() + 1);
            if (estimatedDate.getDay() !== 0) totalDaysToAdd--;
        }

        return estimatedDate.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // useEffect untuk filter orders (tetap sama)
    useEffect(() => {
        if (orders) {
            const activeOrders = orders.filter(
                (order) => order.status !== "completed"
            );
            setQueue(
                activeOrders.map((order, index) => ({
                    ...order,
                    queue_number: index + 1,
                    estimated_completion: calculateEstimatedCompletion(
                        order.created_at,
                        order.shipping_days_to_admin,
                        order.estimation_days
                    ),
                }))
            );
        }
    }, [orders]);

    if (!auth || !auth.user) {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <div className="p-4 sm:p-6">
                    <p className="text-red-500 text-center">
                        Data pengguna tidak tersedia. Silakan login kembali.
                    </p>
                    <Link
                        href="/login"
                        className="block text-center text-blue-600 hover:underline mt-2"
                    >
                        Kembali ke Login
                    </Link>
                </div>
            </AuthenticatedLayout>
        );
    }

    const userName = auth.user.full_name || "Pengguna Tanpa Nama";
    const userRole = auth.user.role || "unknown";

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-xl sm:text-2xl font-bold mb-4">
                    Welcome, {userName}!
                </h1>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {userRole === "customer" ? (
                        <>
                            <Link
                                href="/purchase-requests"
                                className="btn-primary w-full sm:w-auto text-center py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Buat Purchase Request
                            </Link>
                            <Link
                                href="/orders"
                                className="btn-secondary w-full sm:w-auto text-center py-2 px-4 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                            >
                                Lihat Pesanan
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/purchaserequests"
                                className="btn-primary w-full sm:w-auto text-center py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Kelola Purchase Requests
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="btn-secondary w-full sm:w-auto text-center py-2 px-4 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                            >
                                Kelola Orders
                            </Link>
                            <Link
                                href="/services"
                                className="btn-secondary w-full sm:w-auto text-center py-2 px-4 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                            >
                                Kelola Layanan
                            </Link>
                        </>
                    )}
                </div>

                {/* Queue Section */}
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">
                        Antrian Pesanan Saat Ini
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                        *Estimasi pengerjaan dihitung berdasarkan hari kerja
                        (Senin-Sabtu).
                    </p>

                    {queue.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">
                            Tidak ada pesanan dalam antrian saat ini.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 hidden sm:table-cell">
                                            No. Antrian
                                        </th>
                                        <th className="p-3">Order ID</th>
                                        <th className="p-3 hidden md:table-cell">
                                            Pemesan
                                        </th>
                                        <th className="p-3">Layanan</th>
                                        <th className="p-3 hidden sm:table-cell">
                                            Status
                                        </th>
                                        <th className="p-3 hidden lg:table-cell">
                                            Tanggal Pesan
                                        </th>
                                        <th className="p-3">Estimasi</th>
                                        {userRole !== "customer" && (
                                            <th className="p-3">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {queue.map((order) => (
                                        <tr
                                            key={order.order_id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3 hidden sm:table-cell">
                                                {order.queue_number}
                                            </td>
                                            <td className="p-3">
                                                {order.order_id}
                                            </td>
                                            <td className="p-3 hidden md:table-cell">
                                                {order.username}
                                            </td>
                                            <td className="p-3">
                                                {order.service_name}
                                            </td>
                                            <td className="p-3 hidden sm:table-cell">
                                                {order.status}
                                            </td>
                                            <td className="p-3 hidden lg:table-cell">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="p-3">
                                                {order.estimated_completion}
                                            </td>
                                            {userRole !== "customer" && (
                                                <td className="p-3">
                                                    <Link
                                                        href={`/orders/${order.order_id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
