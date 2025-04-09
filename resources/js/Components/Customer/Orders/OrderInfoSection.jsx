import {
    Star,
    Truck,
    Package,
    CheckCircle,
    AlertCircle,
    Info,
    UserCheck,
    CreditCard,
} from "lucide-react";

export default function OrderInfoSection({ order }) {
    const getStatusConfig = (status) => {
        const config = {
            processing: {
                label: "Diproses",
                icon: <Package size={20} className="text-yellow-500" />,
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
            },
            waiting_for_customer_shipment: {
                label: "Menunggu Pengiriman Pelanggan",
                icon: <Truck size={20} className="text-blue-500" />,
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
            },
            waiting_for_admin_confirmation: {
                label: "Menunggu Konfirmasi Admin",
                icon: <Info size={20} className="text-teal-500" />,
                bgColor: "bg-teal-100",
                textColor: "text-teal-800",
            },
            completed: {
                label: "Selesai",
                icon: <CheckCircle size={20} className="text-green-500" />,
                bgColor: "bg-green-100",
                textColor: "text-green-800",
            },
            waiting_for_cust_confirmation: {
                label: "Menunggu Konfirmasi Pelanggan",
                icon: <UserCheck size={20} className="text-blue-500" />,
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
            },
            customer_complain: {
                label: "Komplain",
                icon: <AlertCircle size={20} className="text-red-500" />,
                bgColor: "bg-red-100",
                textColor: "text-red-800",
            },
            waiting_for_payment: {
                label: "Menunggu Pembayaran",
                icon: <CreditCard size={20} className="text-orange-500" />,
                bgColor: "bg-orange-100",
                textColor: "text-orange-800",
            },
            waiting_for_shipment: {
                label: "Menunggu Pengiriman",
                icon: <Truck size={20} className="text-purple-500" />,
                bgColor: "bg-purple-100",
                textColor: "text-purple-800",
            },
            shipped: {
                label: "Dikirim",
                icon: <Truck size={20} className="text-teal-500" />,
                bgColor: "bg-teal-100",
                textColor: "text-teal-800",
            },
        };
        return (
            config[status] || {
                label: status,
                icon: null,
                bgColor: "bg-gray-100",
                textColor: "text-gray-800",
            }
        );
    };

    const statusConfig = getStatusConfig(order.status);

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
                        {order.offer_price.purchase_request.user.full_name}
                    </p>
                    <p>
                        <strong>Layanan:</strong>{" "}
                        {
                            order.offer_price.purchase_request.service
                                .service_name
                        }
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
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                        >
                            {statusConfig.icon}
                            <span className="ml-1">{statusConfig.label}</span>
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}
