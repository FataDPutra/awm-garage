import React, { useState } from "react";
import { Truck, ZoomIn, X } from "lucide-react";

export default function ShippingInfoSection({ order, uploadedProof, post }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (
        !order.shipping &&
        !order.shipping_receipt_customer &&
        !order.shipping_proof_customer
    )
        return null;

    const handleConfirmReceived = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_id}/confirm-received-customer`, {
            preserveScroll: true,
            onSuccess: () => alert("Barang telah dikonfirmasi diterima!"),
            onError: (errors) =>
                alert(
                    "Gagal mengkonfirmasi: " +
                        (errors.message || "Unknown error")
                ),
        });
    };

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo); // Gunakan path langsung (uploadedProof)
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <Truck size={20} className="mr-2 text-blue-500" />
                Informasi Pengiriman
            </h3>

            {/* Shipping Customer (Dari Customer) */}
            {(order.shipping_receipt_customer ||
                order.shipping_proof_customer) && (
                <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-800 mb-2">
                        Pengiriman dari Customer
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div className="space-y-2">
                            {order.shipping_receipt_customer && (
                                <p>
                                    <strong>Nomor Resi:</strong>{" "}
                                    {order.shipping_receipt_customer}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            {uploadedProof && (
                                <div>
                                    <p className="font-medium">
                                        Bukti Pengiriman:
                                    </p>
                                    <div
                                        className="relative group cursor-pointer"
                                        onClick={(e) =>
                                            openPhoto(uploadedProof, e)
                                        }
                                    >
                                        <img
                                            src={uploadedProof}
                                            alt="Bukti Pengiriman dari Customer"
                                            className="w-full max-w-xs h-auto object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg mt-1"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                            <ZoomIn
                                                size={24}
                                                className="text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Shipping Non-Customer (Ke Customer) */}
            {order.shipping && (
                <div>
                    {order.shipping_receipt_customer && <hr className="mb-6" />}
                    <h4 className="text-md font-medium text-gray-800 mb-2">
                        Pengiriman ke Customer
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div className="space-y-2">
                            <p>
                                <strong>Kurir:</strong>{" "}
                                {order.shipping.courier_name} (
                                {order.shipping.courier_service})
                            </p>
                            <p>
                                <strong>Nomor Resi:</strong>{" "}
                                {order.shipping.tracking_number ||
                                    "Belum Ditambahkan"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <strong>Tanggal Pengiriman:</strong>{" "}
                                {order.shipping.shipping_date ||
                                    "Belum Dikirim"}
                            </p>
                            <p>
                                <strong>Tanggal Diterima:</strong>{" "}
                                {order.shipping.received_date ||
                                    "Belum Diterima"}
                            </p>
                            <p>
                                <strong>Status Pengiriman:</strong>{" "}
                                {order.shipping.status === "in_transit"
                                    ? "Dalam Pengiriman"
                                    : "Diterima"}
                            </p>
                        </div>
                    </div>
                    {order.shipping.status === "in_transit" && (
                        <button
                            onClick={handleConfirmReceived}
                            className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-md"
                        >
                            Konfirmasi Barang Diterima
                        </button>
                    )}
                </div>
            )}

            {/* Modal untuk foto ukuran penuh */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-auto"
                    onClick={closePhoto}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedPhoto}
                            alt="Foto Ukuran Penuh"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-lg"
                        />
                        <button
                            onClick={closePhoto}
                            className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition-all duration-200 z-10 shadow-md"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
