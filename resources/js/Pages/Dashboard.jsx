import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({ auth, orders }) {
    const [queue, setQueue] = useState([]);

    // Fungsi untuk menghitung estimasi selesai berdasarkan created_at, shipping_days_to_admin, dan estimation_days
    const calculateEstimatedCompletion = (
        createdAt,
        shippingDaysToAdmin,
        estimationDays
    ) => {
        const startDate = new Date(createdAt);
        let estimatedDate = new Date(startDate);
        let totalDaysToAdd = (shippingDaysToAdmin || 2) + (estimationDays || 3); // Jumlahkan hari pengiriman dan pengerjaan

        // Tambah hari kerja (hanya skip Minggu)
        while (totalDaysToAdd > 0) {
            estimatedDate.setDate(estimatedDate.getDate() + 1);
            const dayOfWeek = estimatedDate.getDay();
            if (dayOfWeek !== 0) {
                // Hanya skip Minggu (0), Sabtu (6) dihitung
                totalDaysToAdd--;
            }
        }

        return estimatedDate.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Filter order yang belum selesai dan hitung estimasi
    useEffect(() => {
        if (orders) {
            const activeOrders = orders.filter(
                (order) => order.status !== "completed"
            );
            setQueue(
                activeOrders.map((order, index) => ({
                    ...order,
                    queue_number: index + 1, // Nomor antrian
                    estimated_completion: calculateEstimatedCompletion(
                        order.created_at,
                        order.shipping_days_to_admin,
                        order.estimation_days
                    ),
                }))
            );
        }
    }, [orders]);

    // Debugging di frontend
    console.log("Dashboard Props:", { auth, orders });

    // Tangani kasus ketika auth atau auth.user tidak ada
    if (!auth || !auth.user) {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <div className="p-6">
                    <p className="text-red-500">
                        Data pengguna tidak tersedia. Silakan login kembali.
                    </p>
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
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
            <div className="p-6">
                <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
                <div className="mt-4">
                    {userRole === "customer" ? (
                        <>
                            <Link
                                href="/purchase-requests"
                                className="btn-primary"
                            >
                                Buat Purchase Request
                            </Link>
                            <Link href="/orders" className="btn-secondary ml-4">
                                Lihat Pesanan
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/purchaserequests"
                                className="btn-primary"
                            >
                                Kelola Purchase Requests
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="btn-secondary ml-4"
                            >
                                Kelola Orders
                            </Link>
                            <Link
                                href="/services"
                                className="btn-secondary ml-4"
                            >
                                Kelola Layanan
                            </Link>
                        </>
                    )}
                </div>

                {/* Antrian Pesanan untuk semua pengguna */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">
                        Antrian Pesanan Saat Ini
                    </h2>
                    <p className="text-gray-600 mb-2">
                        *Estimasi pengerjaan dihitung berdasarkan hari kerja
                        (Senin-Sabtu). Semakin cepat barang dikirim dari
                        customer, semakin cepat pengerjaan selesai.
                    </p>
                    {queue.length === 0 ? (
                        <p className="text-gray-600">
                            Tidak ada pesanan dalam antrian saat ini.
                        </p>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-4">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3">No. Antrian</th>
                                        <th className="p-3">Order ID</th>
                                        <th className="p-3">Pemesan</th>
                                        <th className="p-3">Layanan</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Tanggal Pesan</th>
                                        <th className="p-3">
                                            Estimasi Selesai
                                        </th>
                                        {userRole !== "customer" && (
                                            <th className="p-3">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {queue.map((order) => (
                                        <tr
                                            key={order.order_id}
                                            className="border-b"
                                        >
                                            <td className="p-3">
                                                {order.queue_number}
                                            </td>
                                            <td className="p-3">
                                                {order.order_id}
                                            </td>
                                            <td className="p-3">
                                                {order.username}
                                            </td>
                                            <td className="p-3">
                                                {order.service_name}
                                            </td>
                                            <td className="p-3">
                                                {order.status}
                                            </td>
                                            <td className="p-3">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
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
                                                        Lihat Detail
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
