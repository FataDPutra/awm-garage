import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import StatusSelector from "@/Components/StatusSelector";
import StatusIndicator from "@/Components/StatusIndicator";
import OrderTable from "@/Components/OrderTable";
import OrderList from "@/Components/OrderList";
import { Package } from "lucide-react";

export default function Index({ auth }) {
    const { orders } = usePage().props;
    const [selectedStatus, setSelectedStatus] = useState("all");

    const filteredOrders =
        selectedStatus === "all"
            ? orders
            : orders.filter((order) => order.status === selectedStatus);

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <Package size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Daftar Pesanan
                    </h2>
                </div>
            }
        >
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Daftar Semua Pesanan
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola pesanan pelanggan dengan mudah dan efisien.
                        </p>
                    </div>
                </div>

                <StatusSelector
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
                <StatusIndicator selectedStatus={selectedStatus} />

                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="hidden sm:block">
                        <OrderTable orders={filteredOrders} />
                    </div>
                    <div className="block sm:hidden">
                        <OrderList orders={filteredOrders} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
