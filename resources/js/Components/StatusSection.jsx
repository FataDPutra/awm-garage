import React from "react";
import { Truck, Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";

const StatusSection = ({ purchaseRequest }) => {
    const statusStyles = {
        pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
        offer_sent: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            icon: DollarSign,
        },
        waiting_for_dp: {
            bg: "bg-orange-100",
            text: "text-orange-800",
            icon: Clock,
        },
        processing: {
            bg: "bg-green-100",
            text: "text-green-600",
            icon: CheckCircle,
        },
        rejected: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
    };

    const currentStatus = statusStyles[purchaseRequest.status] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: Clock,
    };
    const StatusIcon = currentStatus.icon;

    const statusMessages = {
        pending: "Pesanan ini sedang menunggu penawaran dari admin.",
        offer_sent:
            "Penawaran telah dikirim ke pelanggan. Menunggu keputusan pelanggan.",
        waiting_for_dp:
            "Menunggu pelanggan untuk melakukan pembayaran DP atau penuh.",
        processing: "Pesanan sedang diproses setelah pembayaran diterima.",
        rejected: "Penawaran telah ditolak oleh pelanggan.",
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Truck size={20} className="mr-2 text-blue-500" /> Status
                Pesanan
            </h3>
            <div className="space-y-4">
                <div
                    className={`${currentStatus.bg} p-4 rounded-lg flex items-center gap-3`}
                >
                    <StatusIcon size={24} className={currentStatus.text} />
                    <div>
                        <p className={`font-semibold ${currentStatus.text}`}>
                            Status:{" "}
                            {purchaseRequest.status
                                .replace("_", " ")
                                .toUpperCase()}
                        </p>
                        <p className="text-gray-700">
                            {statusMessages[purchaseRequest.status] ||
                                "Status tidak diketahui."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusSection;
