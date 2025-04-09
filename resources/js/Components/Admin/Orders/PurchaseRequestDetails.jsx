import React, { useState } from "react";
import { Package, ZoomIn, X } from "lucide-react";

export default function PurchaseRequestDetails({ purchaseRequest }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const formatShippingDetails = (details) => {
        if (!details) return "Tidak ada detail";
        return (
            <ul className="list-disc pl-5 text-sm">
                <li>
                    <strong>Nama:</strong> {details.name}
                </li>
                <li>
                    <strong>Layanan:</strong> {details.service} -{" "}
                    {details.description}
                </li>
                <li>
                    <strong>Biaya:</strong> Rp{" "}
                    {parseFloat(details.cost).toLocaleString()}
                </li>
                <li>
                    <strong>ETD:</strong> {details.etd}
                </li>
            </ul>
        );
    };

    const formatAddress = (address) => {
        if (!address) return "Tidak ada alamat";
        return `${address.address}, ${address.subdistrict_name}, ${address.district_name}, ${address.city_name}, ${address.province_name} ${address.zip_code}`;
    };

    const formatAdditionalDetails = (details) => {
        if (!details || details.length === 0)
            return "Tidak ada detail tambahan";
        return (
            <ul className="list-disc pl-5 text-sm">
                {details.map((item, index) => (
                    <li key={index}>
                        <strong>{item.name}</strong> - Rp{" "}
                        {parseFloat(item.additional_price).toLocaleString()}
                        {item.image_path && (
                            <div
                                className="relative group cursor-pointer mt-1"
                                onClick={(e) => openPhoto(item.image_path, e)}
                            >
                                <img
                                    src={`/storage/${item.image_path}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                    <ZoomIn size={16} className="text-white" />
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(`/storage/${photo.replace(/\\/g, "")}`);
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <Package size={20} className="mr-2 text-blue-500" />
                Detail Permintaan Pesanan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                <div className="space-y-4">
                    <p>
                        <strong>Deskripsi:</strong>{" "}
                        {purchaseRequest.description || "Tidak ada deskripsi"}
                    </p>
                    <p>
                        <strong>Berat:</strong> {purchaseRequest.weight} kg
                    </p>
                    <p>
                        <strong>Biaya Pengiriman ke Admin:</strong> Rp{" "}
                        {purchaseRequest.shipping_cost_to_admin.toLocaleString()}
                    </p>
                    <div>
                        <strong>Detail Pengiriman ke Admin:</strong>
                        <div className="mt-1">
                            {formatShippingDetails(
                                purchaseRequest.shipping_to_admin_details
                            )}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong>Alamat Sumber:</strong>{" "}
                        {formatAddress(purchaseRequest.source_address)}
                    </p>
                    <p>
                        <strong>Alamat Tujuan:</strong>{" "}
                        {formatAddress(purchaseRequest.destination_address)}
                    </p>
                    <div>
                        <strong>Preferensi Pengiriman ke Pelanggan:</strong>
                        <div className="mt-1">
                            {formatShippingDetails(
                                purchaseRequest.shipping_to_customer_preference
                            )}
                        </div>
                    </div>
                    <div>
                        <strong>Detail Tambahan:</strong>
                        <div className="mt-1">
                            {formatAdditionalDetails(
                                purchaseRequest.additional_details
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {purchaseRequest.photo_path && (
                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        <strong>Foto Barang:</strong>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {purchaseRequest.photo_path.map((photo, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={(e) => openPhoto(photo, e)}
                            >
                                <img
                                    src={`/storage/${photo}`}
                                    alt={`Request Photo ${index}`}
                                    className="w-full h-48 md:h-64 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                    <ZoomIn size={24} className="text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
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
