import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Package } from "lucide-react";
import StatusSelector from "@/Components/StatusSelector";
import StatusIndicator from "@/Components/StatusIndicator";
import OrderTable from "@/Components/OrderTable";
import OrderList from "@/Components/OrderList";

export default function CustomerIndex({ auth }) {
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
                        Daftar Pesanan Anda
                    </h2>
                </div>
            }
        >
            <div className="container mx-auto px-6 py-6 max-w-7xl">
                <StatusSelector
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
                <StatusIndicator selectedStatus={selectedStatus} />
                <div className="bg-white shadow rounded-lg">
                    <div className="hidden sm:block p-4">
                        <OrderTable
                            orders={filteredOrders}
                            linkPrefix="/orders"
                            showCustomerColumn={false}
                        />
                    </div>
                    <div className="block sm:hidden">
                        <OrderList
                            orders={filteredOrders}
                            linkPrefix="/orders"
                            showCustomerColumn={false}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
