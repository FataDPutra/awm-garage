import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function Show() {
    const { order } = usePage().props;
    const [completedPhoto, setCompletedPhoto] = useState([]);
    const [revisedPhoto, setRevisedPhoto] = useState([]);
    const [trackingNumber, setTrackingNumber] = useState("");

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setCompletedPhoto((prev) => [...prev, ...newPhotos]);
    };

    const handleRemovePhoto = (index) => {
        setCompletedPhoto((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePhotoChangeRevised = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setRevisedPhoto((prev) => [...prev, ...newPhotos]);
    };

    const handleRemovePhotoRevised = (index) => {
        setRevisedPhoto((prev) => prev.filter((_, i) => i !== index));
    };

    const handleConfirmReceived = () => {
        Inertia.post(`/admin/orders/${order.order_id}/confirm-received`);
    };

    const handleMarkAsReadyToShip = () => {
        Inertia.post(`/admin/orders/${order.order_id}/ready-to-ship`);
    };

    // [CHANGED] Fungsi untuk Membuat Pengiriman dengan Nomor Resi
    const handleCreateShipment = (e) => {
        e.preventDefault();
        Inertia.post(
            `/admin/orders/${order.order_id}/create-shipment`,
            {
                tracking_number: trackingNumber,
            },
            {
                onSuccess: () => {
                    alert("Pengiriman berhasil dibuat!");
                    setTrackingNumber(""); // Reset field setelah sukses
                },
                onError: (errors) => {
                    alert(
                        "Gagal membuat pengiriman: " +
                            (errors.tracking_number ||
                                errors.message ||
                                "Unknown error")
                    );
                },
            }
        );
    };

    const handleUploadCompletedPhoto = (e) => {
        e.preventDefault();
        if (completedPhoto.length === 0)
            return alert("Silakan pilih setidaknya satu foto!");

        const formData = new FormData();
        completedPhoto.forEach((photo) => {
            formData.append("completed_photo[]", photo.file);
        });

        Inertia.post(
            `/admin/orders/${order.order_id}/upload-completed`,
            formData,
            {
                onSuccess: () => {
                    alert("Foto hasil pengerjaan berhasil diunggah!");
                    setCompletedPhoto([]);
                },
                onError: (errors) => {
                    alert("Gagal mengunggah foto: " + errors.completedPhoto);
                },
            }
        );
    };

    const handleUploadAdditionalPhoto = (e) => {
        e.preventDefault();
        if (revisedPhoto.length === 0)
            return alert("Silakan pilih setidaknya satu foto!");

        const formData = new FormData();
        revisedPhoto.forEach((photo) => {
            formData.append("revised_photo[]", photo.file);
        });

        Inertia.post(
            `/admin/orders/${order.order_id}/upload-revision-photo`,
            formData,
            {
                onSuccess: () => {
                    alert("Foto hasil pengerjaan berhasil diunggah!");
                    setRevisedPhoto([]);
                },
                onError: (errors) => {
                    alert("Gagal mengunggah foto: " + errors.revisedPhoto);
                },
            }
        );
    };

    return (
        <div className="p-6 bg-white shadow rounded">
            <h2 className="text-lg font-bold mb-4">Detail Pesanan</h2>

            <p>
                <strong>Order ID:</strong> {order.order_id}
            </p>
            <p>
                <strong>Customer:</strong>{" "}
                {order.offer_price.purchase_request.user.full_name}
            </p>
            <p>
                <strong>Service:</strong>{" "}
                {order.offer_price.purchase_request.service.service_name}
            </p>
            <p>
                <strong>Total Harga:</strong> Rp {order.offer_price.total_price}
            </p>
            <p>
                <strong>Status:</strong> {order.status}
            </p>

            {order.completed_photo_path && (
                <p>
                    <strong>Hasil Pengerjaan </strong>
                </p>
            )}

            {order.completed_photo_path &&
                (Array.isArray(order.completed_photo_path) ? (
                    order.completed_photo_path.map((photo, index) => (
                        <div className="mb-4" key={index}>
                            <img
                                src={`/storage/${photo}`}
                                alt={`Order ${index}`}
                                className="w-16 h-16 object-cover rounded border"
                            />
                        </div>
                    ))
                ) : (
                    <img
                        src={`/storage/${order.completed_photo_path}`}
                        alt="Order"
                        className="w-full max-w-md rounded shadow-md"
                    />
                ))}

            {order.status === "processing" && (
                <form onSubmit={handleUploadCompletedPhoto} className="mt-4">
                    <label className="block mb-2 font-medium">
                        Upload Hasil Pengerjaan:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                    />
                    {completedPhoto.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {completedPhoto.map((photo, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={photo.preview}
                                        alt="Preview"
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Upload Foto
                    </button>
                </form>
            )}

            {order.complains &&
                order.complains.map(
                    (complain, index) =>
                        complain.revised_photo_path && (
                            <div className="mb-4" key={index}>
                                {complain.customer_feedback && (
                                    <>
                                        <p>
                                            <strong>
                                                Perubahan {index + 1}
                                            </strong>
                                        </p>
                                        <p>
                                            <strong>Customer Feedback:</strong>{" "}
                                            {complain.customer_feedback}
                                        </p>
                                    </>
                                )}
                                {Array.isArray(complain.revised_photo_path) ? (
                                    complain.revised_photo_path.map(
                                        (photo, photoIndex) => (
                                            <img
                                                key={photoIndex}
                                                src={`/storage/${photo}`}
                                                alt={`Revised ${photoIndex}`}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        )
                                    )
                                ) : (
                                    <img
                                        src={`/storage/${complain.revised_photo_path}`}
                                        alt="Revised"
                                        className="w-full max-w-md rounded shadow-md"
                                    />
                                )}
                            </div>
                        )
                )}

            {order.status === "customer_complain" &&
                order.customer_confirmation === "rejected" && (
                    <>
                        <div className="mt-4 p-4 bg-red-100 rounded">
                            <h2 className="text-lg font-semibold text-red-600">
                                Keluhan Pelanggan:
                            </h2>
                            <p>
                                {
                                    order.complains[order.complains.length - 1]
                                        .customer_feedback
                                }
                            </p>
                        </div>
                        <form
                            onSubmit={handleUploadAdditionalPhoto}
                            className="mt-4"
                        >
                            <label className="block mb-2 font-medium">
                                Upload Foto Revisi:
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoChangeRevised}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                            />
                            {revisedPhoto.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {revisedPhoto.map((photo, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={photo.preview}
                                                alt="Preview"
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                onClick={() =>
                                                    handleRemovePhotoRevised(
                                                        index
                                                    )
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Upload Foto Revisi
                            </button>
                        </form>
                    </>
                )}

            {order.shipping && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h3 className="font-bold">Informasi Pengiriman</h3>
                    <p>
                        <strong>Kurir:</strong> {order.shipping.courier_code} -{" "}
                        {order.shipping.courier_name} -{" "}
                        {order.shipping.courier_service}{" "}
                    </p>
                    <p>
                        <strong>Nomor Resi:</strong>{" "}
                        {order.shipping.tracking_number || "Belum Ditambahkan"}
                    </p>
                    <p>
                        <strong>Tanggal Pengiriman:</strong>{" "}
                        {order.shipping.shipping_date || "Belum Dikirim"}
                    </p>
                    <p>
                        <strong>Tanggal Diterima:</strong>{" "}
                        {order.shipping.received_date || "Belum Diterima"}
                    </p>
                    <p>
                        <strong>Status Pengiriman:</strong>{" "}
                        {order.shipping.status === "in_transit"
                            ? "Dalam Pengiriman"
                            : "Diterima"}
                    </p>
                    <p>
                        <strong>Penerima:</strong>{" "}
                        {order.offer_price.purchase_request.user.full_name}{" "}
                        <br />
                        <strong>Alamat Penerima:</strong> <br />
                        {order.offer_price.purchase_request.user.phone} <br />
                        {
                            order.offer_price.purchase_request
                                .destination_address.address
                        }{" "}
                        <br />
                        {
                            order.offer_price.purchase_request
                                .destination_address.subdistrict_name
                        }
                        ,{" "}
                        {
                            order.offer_price.purchase_request
                                .destination_address.district_name
                        }{" "}
                        <br />
                        {
                            order.offer_price.purchase_request
                                .destination_address.city_name
                        }
                        ,{" "}
                        {
                            order.offer_price.purchase_request
                                .destination_address.province_name
                        }{" "}
                        <br />
                        {
                            order.offer_price.purchase_request
                                .destination_address.zip_code
                        }{" "}
                        <br />
                        {
                            order.offer_price.purchase_request
                                .destination_address.address_details
                        }
                    </p>
                </div>
            )}

            {order.status === "waiting_for_admin_confirmation" && (
                <>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">
                            No Resi Pengiriman dari Customer:{" "}
                            {order.shipping_receipt_customer}
                        </h2>
                        <img
                            src={`/storage/${order.shipping_proof_customer}`}
                            alt="Completed Work"
                            className="w-64 h-64 object-cover mt-2 border rounded-lg"
                        />
                    </div>
                    <button
                        onClick={handleConfirmReceived}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Konfirmasi Barang Diterima
                    </button>
                </>
            )}

            {/* [CHANGED] Form untuk Membuat Pengiriman dengan Nomor Resi */}
            {order.status === "waiting_for_shipment" && (
                <form
                    onSubmit={handleCreateShipment}
                    className="mt-4 p-4 bg-gray-100 rounded"
                >
                    <h2 className="text-lg font-semibold mb-2">
                        Buat Pengiriman
                    </h2>
                    <label className="block mb-2">
                        <span className="text-gray-700">
                            Nomor Resi (Opsional):
                        </span>
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Masukkan nomor resi pengiriman"
                        />
                    </label>
                    <button
                        type="submit"
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Create Shipment
                    </button>
                </form>
            )}
        </div>
    );
}
