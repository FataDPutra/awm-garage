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
            <AuthenticatedLayout>
                <Head title="Home">
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                </Head>
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
                <h2 className="text-3xl font-bold text-blue-600 flex items-center animate-fade-in animate-pulse">
                    <Home size={28} className="mr-2 animate-bounce-subtle" />
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
            </Head>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-2">
                        Antrian Pesanan
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        *Estimasi dihitung berdasarkan hari kerja (Senin-Sabtu)
                    </p>

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
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
