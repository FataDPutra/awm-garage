import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import QueueCard from "@/Components/QueueCard";
import { Home } from "lucide-react";

export default function Dashboard({ auth, orders }) {
    const [queue, setQueue] = useState([]);
    const { url } = usePage();

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
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-3 animate-pulse">
                        <Home size={28} className="text-blue-500" />
                        <h2 className="text-3xl font-bold text-blue-600">
                            Dashboard
                        </h2>
                    </div>
                }
            >
                <Head title="Dashboard" />
                <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center transition-all hover:shadow-lg">
                        <p className="text-red-600 font-semibold mb-4">
                            Data pengguna tidak tersedia. Silakan login kembali.
                        </p>
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const userRole = auth.user.role || "unknown";

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <Home size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Antrian Pesanan
                        </h1>
                        <p className="text-gray-600 mt-1">
                            *Estimasi dihitung berdasarkan hari kerja
                            (Senin-Sabtu)
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="p-6">
                        {queue.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <p className="text-lg font-medium">
                                    Tidak ada pesanan dalam antrian
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {queue.map((order) => (
                                    <QueueCard
                                        key={order.order_id}
                                        order={order}
                                        userRole={userRole}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
