import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { CheckCircle, XCircle, DollarSign, PenIcon, Truck } from "lucide-react";

const ActionSection = ({ purchaseRequest }) => {
    const handleAcceptOffer = () => {
        Inertia.post(
            route("purchase_requests.acceptOffer", purchaseRequest.id)
        );
    };

    const handleRejectOffer = () => {
        Inertia.post(
            route("purchase_requests.rejectOffer", purchaseRequest.id)
        );
    };

    const handleDP = () => {
        Inertia.get(
            route("payments.payment-dp", purchaseRequest.offer_price.id)
        );
    };

    const handleFull = () => {
        Inertia.get(
            route("payments.payment-full", purchaseRequest.offer_price.id)
        );
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Truck size={20} className="mr-2 text-blue-500" /> Status &
                Tindakan
            </h3>
            <div className="space-y-4">
                {/* Status */}
                {purchaseRequest.status === "pending" && (
                    <div>
                        <p className="text-gray-600 mb-4">
                            Pesanan Anda sedang menunggu penawaran dari kami.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() =>
                                    Inertia.get(
                                        route(
                                            "purchase_requests.edit",
                                            purchaseRequest.id
                                        )
                                    )
                                }
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
                            >
                                <PenIcon size={18} className="mr-2" /> Ubah
                                Pesanan
                            </button>
                        </div>
                    </div>
                )}
                {purchaseRequest.status === "offer_sent" &&
                    purchaseRequest.offer_price && (
                        <div>
                            <p className="text-gray-600 mb-4">
                                Kami telah mengirimkan penawaran. Apa keputusan
                                Anda?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    onClick={handleAcceptOffer}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
                                >
                                    <CheckCircle size={18} className="mr-2" />{" "}
                                    Terima Penawaran
                                </button>
                                <button
                                    onClick={handleRejectOffer}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
                                >
                                    <XCircle size={18} className="mr-2" /> Tolak
                                    Penawaran
                                </button>
                            </div>
                        </div>
                    )}
                {purchaseRequest.status === "waiting_for_dp" && (
                    <div>
                        <p className="text-gray-600 mb-4">
                            Silakan lakukan pembayaran untuk memulai proses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={handleDP}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
                            >
                                <DollarSign size={18} className="mr-2" /> Bayar
                                DP
                            </button>
                            <button
                                onClick={handleFull}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
                            >
                                <DollarSign size={18} className="mr-2" /> Bayar
                                Penuh
                            </button>
                        </div>
                    </div>
                )}
                {purchaseRequest.status === "processing" &&
                    purchaseRequest.offer_price && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p>
                                <strong>Status Pembayaran:</strong>{" "}
                                {purchaseRequest.offer_price.status}
                            </p>
                            <p>
                                <strong>Status Pesanan:</strong> Siapkan barang
                                Anda untuk dikirim ke kami.
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ActionSection;
