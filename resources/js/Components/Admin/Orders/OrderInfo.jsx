import React from "react";
import {
    Info,
    Hourglass,
    UserCheck,
    Truck,
    AlertTriangle,
    CheckCircle,
    CreditCard,
    Package,
    Clipboard,
} from "lucide-react";

export default function OrderInfo({ order, purchaseRequest }) {
    const statusConfig = {
        processing: {
            label: "Diproses",
            icon: <Hourglass size={16} className="mr-1" />,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
        },
        waiting_for_customer_shipment: {
            label: "Menunggu Pengiriman Pelanggan",
            icon: <Truck size={16} className="mr-1" />,
            bgColor: "bg-blue-100",
            textColor: "text-blue-800",
        },
        waiting_for_admin_confirmation: {
            label: "Menunggu Konfirmasi Admin",
            icon: <Clipboard size={16} className="mr-1" />,
            bgColor: "bg-teal-100",
            textColor: "text-teal-800",
        },
        completed: {
            label: "Selesai",
            icon: <CheckCircle size={16} className="mr-1" />,
            bgColor: "bg-green-100",
            textColor: "text-green-800",
        },
        waiting_for_cust_confirmation: {
            label: "Menunggu Konfirmasi Pelanggan",
            icon: <UserCheck size={16} className="mr-1" />,
            bgColor: "bg-blue-100",
            textColor: "text-blue-800",
        },
        customer_complain: {
            label: "Komplain",
            icon: <AlertTriangle size={16} className="mr-1" />,
            bgColor: "bg-red-100",
            textColor: "text-red-800",
        },
        approved: {
            label: "Disetujui",
            icon: <CheckCircle size={16} className="mr-1" />,
            bgColor: "bg-green-100",
            textColor: "text-green-800",
        },
        revised: {
            label: "Direvisi",
            icon: <Package size={16} className="mr-1" />,
            bgColor: "bg-orange-100",
            textColor: "text-orange-800",
        },
        waiting_for_payment: {
            label: "Belum Bayar",
            icon: <CreditCard size={16} className="mr-1" />,
            bgColor: "bg-orange-100",
            textColor: "text-orange-800",
        },
        waiting_for_shipment: {
            label: "Menunggu Pengiriman",
            icon: <Truck size={16} className="mr-1" />,
            bgColor: "bg-purple-100",
            textColor: "text-purple-800",
        },
        shipped: {
            label: "Dikirim",
            icon: <Truck size={16} className="mr-1" />,
            bgColor: "bg-teal-100",
            textColor: "text-teal-800",
        },
    };

    const status = statusConfig[order.status] || {
        label: order.status,
        icon: null,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <Info size={20} className="mr-2 text-blue-500" />
                Informasi Pesanan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                <div className="space-y-2">
                    <p>
                        <strong>ID Pesanan:</strong> {order.order_id}
                    </p>
                    <p>
                        <strong>Pelanggan:</strong>{" "}
                        {purchaseRequest.user.full_name}
                    </p>
                    <p>
                        <strong>Layanan:</strong>{" "}
                        {purchaseRequest.service.service_name}
                    </p>
                </div>
                <div className="space-y-2">
                    <p>
                        <strong>Total Harga:</strong> Rp{" "}
                        {order.offer_price.total_price.toLocaleString()}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium ${status.bgColor} ${status.textColor} rounded`}
                        >
                            {status.icon}
                            {status.label}
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}
