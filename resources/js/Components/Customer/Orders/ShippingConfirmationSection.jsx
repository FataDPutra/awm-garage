import React, { useState } from "react";
import { Upload, ZoomIn, X } from "lucide-react";

export default function ShippingConfirmationSection({
    order,
    data,
    setData,
    post,
    processing,
    previewImage,
    setPreviewImage,
    uploadedProof,
    setUploadedProof,
}) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (order.status !== "waiting_for_customer_shipment" || uploadedProof)
        return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_id}/confirm-shipment-customer`, {
            preserveScroll: true,
            onSuccess: (page) => {
                alert("Konfirmasi pengiriman berhasil!");
                if (page.props.order.shipping_proof_customer) {
                    setUploadedProof(
                        `/storage/${page.props.order.shipping_proof_customer}`
                    );
                    setData(
                        "shipping_receipt_customer",
                        page.props.order.shipping_receipt_customer
                    );
                } else if (data.shipping_proof_customer) {
                    setUploadedProof(previewImage);
                }
                setPreviewImage(null);
            },
            onError: (errors) =>
                alert(
                    "Gagal mengkonfirmasi pengiriman: " +
                        (errors.message || "Unknown error")
                ),
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("shipping_proof_customer", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo); // Gunakan path langsung (previewImage)
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Konfirmasi Pengiriman Barang
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Resi Pengiriman:
                    </label>
                    <input
                        type="text"
                        value={data.shipping_receipt_customer}
                        onChange={(e) =>
                            setData("shipping_receipt_customer", e.target.value)
                        }
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unggah Bukti Pengiriman:
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="shipping-proof-upload"
                            required
                        />
                        <label
                            htmlFor="shipping-proof-upload"
                            className="cursor-pointer"
                        >
                            <Upload
                                size={32}
                                className="mx-auto text-gray-500 mb-2"
                            />
                            <p className="text-sm text-gray-600">
                                Drag & drop foto atau{" "}
                                <span className="text-blue-600 underline">
                                    klik untuk memilih
                                </span>
                            </p>
                        </label>
                    </div>
                    {previewImage && !uploadedProof && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Preview:
                            </p>
                            <div
                                className="relative group cursor-pointer"
                                onClick={(e) => openPhoto(previewImage, e)}
                            >
                                <img
                                    src={previewImage}
                                    alt="Preview Bukti Pengiriman"
                                    className="w-full max-w-xs h-auto object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                    <ZoomIn size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md"
                    disabled={processing}
                >
                    {processing ? "Mengirim..." : "Konfirmasi Pengiriman"}
                </button>
            </form>

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
