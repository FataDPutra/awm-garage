import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Plus,
    Clock,
    Send,
    DollarSign,
    Package,
    CheckCircle,
    XCircle,
    FileText,
} from "lucide-react";
import StatusSelector from "@/Components/PurchaseRequest/StatusSelector";
import StatusIndicator from "@/Components/PurchaseRequest/StatusIndicator";
import PurchaseRequestTable from "@/Components/PurchaseRequest/PurchaseRequestTable";
import PurchaseRequestList from "@/Components/PurchaseRequest/PurchaseRequestList";

export default function Index() {
    const { purchaseRequests } = usePage().props;
    const [selectedStatus, setSelectedStatus] = useState("all");

    const statusConfig = {
        all: {
            label: "Semua",
            icon: <Clock size={16} className="text-gray-500" />,
            bgColor: "bg-gray-500",
        },
        pending: {
            label: "Menunggu",
            icon: <Clock size={16} className="text-yellow-500" />,
            bgColor: "bg-yellow-500",
        },
        offer_sent: {
            label: "Penawaran Dikirim",
            icon: <Send size={16} className="text-blue-500" />,
            bgColor: "bg-blue-500",
        },
        waiting_for_dp: {
            label: "Menunggu DP",
            icon: <DollarSign size={16} className="text-purple-500" />,
            bgColor: "bg-purple-500",
        },
        processing: {
            label: "Sedang Dikerjakan",
            icon: <Package size={16} className="text-orange-500" />,
            bgColor: "bg-orange-500",
        },
        done: {
            label: "Selesai",
            icon: <CheckCircle size={16} className="text-green-500" />,
            bgColor: "bg-green-500",
        },
        cancelled: {
            label: "Dibatalkan",
            icon: <XCircle size={16} className="text-red-500" />,
            bgColor: "bg-red-500",
        },
    };

    const filteredRequests =
        selectedStatus === "all"
            ? purchaseRequests
            : purchaseRequests.filter(
                  (request) => request.status === selectedStatus
              );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <FileText size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Permintaan Pesanan
                    </h2>
                </div>
            }
        >
            <Head title="Permintaan Pemesanan" />
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Daftar Permintaan Pemesanan Anda
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Mulai pesanan baru dan nikmati layanan terbaik kami!
                        </p>
                    </div>
                    <Link
                        href={route("purchase-requests.create")}
                        className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center animate-pulse"
                    >
                        <Plus size={20} className="mr-2" /> Buat Pesanan Baru
                    </Link>
                </div>

                <StatusSelector
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    statusConfig={statusConfig}
                />
                <StatusIndicator
                    selectedStatus={selectedStatus}
                    statusConfig={statusConfig}
                />

                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                    <div className="hidden sm:block">
                        <PurchaseRequestTable
                            requests={filteredRequests}
                            statusConfig={statusConfig}
                        />
                    </div>
                    <div className="block sm:hidden">
                        <PurchaseRequestList
                            requests={filteredRequests}
                            statusConfig={statusConfig}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
