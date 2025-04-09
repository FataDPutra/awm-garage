import React from "react";
import { Link } from "@inertiajs/react"; // Tambahkan Link untuk tombol navigasi
import {
    DollarSign,
    Truck,
    CreditCard,
    Clock,
    Coins,
    HandCoins,
    Wallet,
} from "lucide-react";

const OfferDetails = ({
    purchaseRequest,
    formatCurrency,
    getTotalEstimatedDays,
}) => {
    // Jika status bukan offer_sent, waiting_for_dp, atau processing, atau tidak ada offer_price, return null
    if (
        !["offer_sent", "waiting_for_dp", "processing"].includes(
            purchaseRequest.status
        ) ||
        !purchaseRequest.offer_price
    ) {
        return null;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <DollarSign size={20} className="mr-2 text-blue-500" />{" "}
                Penawaran Harga
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <p className="flex items-start">
                    <CreditCard size={16} className="mr-2 mt-1 text-blue-500" />
                    <span>
                        {" "}
                        <strong>Harga Layanan:</strong>{" "}
                        {formatCurrency(
                            purchaseRequest.offer_price.service_price
                        )}
                    </span>
                </p>
                <p className="flex items-start">
                    <Coins size={16} className="mr-2 mt-1 text-blue-500" />
                    <span>
                        {" "}
                        <strong>Jumlah DP:</strong>{" "}
                        {formatCurrency(purchaseRequest.offer_price.dp_amount)}
                    </span>
                </p>
                <p className="flex items-start">
                    <Clock size={16} className="mr-2 mt-1 text-blue-500" />
                    <span>
                        {" "}
                        <strong>Estimasi Pengerjaan:</strong>{" "}
                        {purchaseRequest.offer_price.estimation_days} hari{" "}
                        {purchaseRequest.offer_price
                            .shipping_to_customer_details?.etd && (
                            <span>
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
                <p className="flex items-start">
                    <HandCoins size={16} className="mr-2 mt-1 text-blue-500" />
                    <span>
                        {" "}
                        <strong>Biaya Kirim ke Anda:</strong>{" "}
                        {formatCurrency(
                            purchaseRequest.offer_price
                                .shipping_cost_to_customer
                        )}
                    </span>
                </p>
                <p className="flex items-start">
                    <Truck size={16} className="mr-2 mt-1 text-blue-500" />
                    <span>
                        {" "}
                        <strong>Kurir Pengiriman:</strong>{" "}
                        {purchaseRequest.offer_price
                            .shipping_to_customer_details?.name ||
                            "Tidak ada"}{" "}
                        -{" "}
                        {purchaseRequest.offer_price
                            .shipping_to_customer_details?.service || ""}
                    </span>
                </p>
                <p className="flex items-start">
                    <Wallet size={16} className="mr-2 mt-1 text-blue-500" />
                    <span className="font-bold bg-green-200">
                        {" "}
                        <strong>Total Harga:</strong>{" "}
                        {formatCurrency(
                            purchaseRequest.offer_price.total_price
                        )}
                    </span>
                </p>
            </div>

            {/* Tambahan untuk status "processing" */}
            {purchaseRequest.status === "processing" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-blue-700 text-sm font-medium">
                        Proses Pemesanan Anda berhasil , mohon lanjutkan proses
                        di halaman Order. Silakan cek status terbaru di halaman
                        Pesanan.
                    </p>
                    <Link
                        href="/orders"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm shadow"
                    >
                        <Truck size={16} className="mr-2" /> Lihat Pesanan
                    </Link>
                </div>
            )}
        </div>
    );
};

export default OfferDetails;
