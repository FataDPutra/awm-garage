// resources/js/Components/Admin/OfferDetails.jsx
import React from "react";
import { DollarSign, Truck, Clock, CheckCircle, XCircle } from "lucide-react";

const OfferDetails = ({
    purchaseRequest,
    setIsEditingOffer,
    getTotalEstimatedDays,
    formatCurrency,
}) => {
    if (!purchaseRequest.offer_price) return null;

    // Fungsi untuk menampilkan status dengan teks, warna, dan ikon yang lebih ramah pengguna
    const renderStatus = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="flex items-center text-yellow-600 font-medium">
                        <Clock size={16} className="mr-1" />
                        Menunggu Persetujuan
                    </span>
                );
            case "accepted":
                return (
                    <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle size={16} className="mr-1" />
                        Diterima
                    </span>
                );
            case "rejected":
                return (
                    <span className="flex items-center text-red-600 font-medium">
                        <XCircle size={16} className="mr-1" />
                        Ditolak
                    </span>
                );
            default:
                return <span className="text-gray-600">{status}</span>;
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <DollarSign size={20} className="mr-2 text-blue-500" /> Detail
                Penawaran
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <p>
                    <strong>Harga Layanan:</strong>{" "}
                    <span className="font-medium text-gray-800">
                        {formatCurrency(
                            purchaseRequest.offer_price.service_price
                        )}
                    </span>
                </p>
                <p>
                    <strong>Jumlah DP:</strong>{" "}
                    <span className="font-medium text-gray-800">
                        {formatCurrency(purchaseRequest.offer_price.dp_amount)}
                    </span>
                </p>
                <p>
                    <strong>Estimasi Pengerjaan:</strong>{" "}
                    <span className="font-medium text-gray-800">
                        {purchaseRequest.offer_price.estimation_days} hari
                        {purchaseRequest.offer_price
                            .shipping_to_customer_details?.etd && (
                            <span className="text-gray-500">
                                {" "}
                                (Total:{" "}
                                {getTotalEstimatedDays(
                                    purchaseRequest.offer_price.estimation_days,
                                    purchaseRequest.offer_price
                                        .shipping_to_customer_details.etd
                                )}
                                )
                            </span>
                        )}
                    </span>
                </p>
                <p>
                    <strong>Biaya Kirim ke Pelanggan:</strong>{" "}
                    <span className="font-medium text-gray-800">
                        {formatCurrency(
                            purchaseRequest.offer_price
                                .shipping_cost_to_customer
                        )}
                    </span>
                </p>
                <p>
                    <strong>Detail Pengiriman:</strong>{" "}
                    <span className="font-medium text-gray-800">
                        {purchaseRequest.offer_price
                            .shipping_to_customer_details?.name ||
                            "Tidak ada"}{" "}
                        -{" "}
                        {purchaseRequest.offer_price
                            .shipping_to_customer_details?.service || ""}
                    </span>
                </p>
                <p>
                    <strong>Total Harga:</strong>{" "}
                    <span className="font-bold text-gray-800 text-lg">
                        {formatCurrency(
                            purchaseRequest.offer_price.total_price
                        )}
                    </span>
                </p>
                <p className="col-span-1 sm:col-span-2">
                    <strong>Status:</strong>{" "}
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 shadow-sm">
                        {renderStatus(purchaseRequest.offer_price.status)}
                    </span>
                </p>
            </div>
            {purchaseRequest.offer_price.status === "pending" && (
                <button
                    onClick={() => setIsEditingOffer(true)}
                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                >
                    <Truck size={18} className="mr-2" /> Edit Penawaran
                </button>
            )}
        </div>
    );
};

export default OfferDetails;
