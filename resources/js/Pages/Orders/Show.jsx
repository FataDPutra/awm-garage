import React, { useState } from "react";
import Compressor from "compressorjs";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { Package } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import OrderInfo from "@/Components/Admin/Orders/OrderInfo";
import PurchaseRequestDetails from "@/Components/Admin/Orders/PurchaseRequestDetails";
import PhotoSection from "@/Components/Admin/Orders/PhotoSection";
import UploadPhotoSection from "@/Components/Admin/Orders/UploadPhotoSection";
import ShippingInfo from "@/Components/Admin/Orders/ShippingInfo";
import ConfirmReceived from "@/Components/Admin/Orders/ConfirmReceived";
import CreateShipment from "@/Components/Admin/Orders/CreateShipment";
import ReviewSection from "@/Components/Admin/Orders/ReviewSection"; // Impor komponen baru

export default function Show() {
    const { order } = usePage().props;
    const [completedPhoto, setCompletedPhoto] = useState([]);
    const [revisedPhoto, setRevisedPhoto] = useState([]);
    const [trackingNumber, setTrackingNumber] = useState("");

    // Actions for completed photos
    const handleCompletedPhotoChange = (files) => {
        const validFiles = Array.from(files).filter((file) =>
            [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/heic",
            ].includes(file.type)
        );

        validFiles.forEach((file) => {
            new Compressor(file, {
                quality: 0.8,
                maxWidth: 1024,
                maxHeight: 1024,
                mimeType: "image/jpeg",
                success(compressedFile) {
                    const newPhoto = {
                        file: compressedFile,
                        preview: URL.createObjectURL(compressedFile),
                    };
                    setCompletedPhoto((prev) => [...prev, newPhoto]);
                },
                error(err) {
                    console.error("Compression error:", err);
                },
            });
        });

        if (validFiles.length !== files.length) {
            alert(
                "Beberapa file tidak valid. Hanya gambar (JPEG, PNG, JPG, GIF, HEIC) yang diperbolehkan."
            );
        }
    };

    const handleRemoveCompletedPhoto = (index) => {
        setCompletedPhoto((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUploadCompletedPhoto = (e) => {
        e.preventDefault();
        if (completedPhoto.length === 0)
            return alert("Silakan pilih setidaknya satu foto!");
        const formData = new FormData();
        completedPhoto.forEach((photo) =>
            formData.append("completed_photo[]", photo.file)
        );
        Inertia.post(
            `/admin/orders/${order.order_id}/upload-completed`,
            formData,
            {
                onSuccess: () => {
                    alert("Foto berhasil diunggah!");
                    setCompletedPhoto([]);
                },
                onError: (errors) =>
                    alert(
                        "Gagal mengunggah foto: " +
                            (errors.completed_photo || "Unknown error")
                    ),
            }
        );
    };

    // Actions for revised photos
    const handleRevisedPhotoChange = (files) => {
        const validFiles = Array.from(files).filter((file) =>
            [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/heic",
            ].includes(file.type)
        );

        validFiles.forEach((file) => {
            new Compressor(file, {
                quality: 0.8,
                maxWidth: 1024,
                maxHeight: 1024,
                mimeType: "image/jpeg",
                success(compressedFile) {
                    const newPhoto = {
                        file: compressedFile,
                        preview: URL.createObjectURL(compressedFile),
                    };
                    setRevisedPhoto((prev) => [...prev, newPhoto]);
                },
                error(err) {
                    console.error("Compression error:", err);
                },
            });
        });

        if (validFiles.length !== files.length) {
            alert(
                "Beberapa file tidak valid. Hanya gambar (JPEG, PNG, JPG, GIF, HEIC) yang diperbolehkan."
            );
        }
    };

    const handleRemoveRevisedPhoto = (index) => {
        setRevisedPhoto((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUploadRevisedPhoto = (e) => {
        e.preventDefault();
        if (revisedPhoto.length === 0)
            return alert("Silakan pilih setidaknya satu foto!");
        const formData = new FormData();
        revisedPhoto.forEach((photo) =>
            formData.append("revised_photo[]", photo.file)
        );
        Inertia.post(
            `/admin/orders/${order.order_id}/upload-revision-photo`,
            formData,
            {
                onSuccess: () => {
                    alert("Foto revisi berhasil diunggah!");
                    setRevisedPhoto([]);
                },
                onError: (errors) =>
                    alert("Gagal mengunggah foto: " + errors.revisedPhoto),
            }
        );
    };

    // Other actions
    const handleConfirmReceived = () => {
        Inertia.post(`/admin/orders/${order.order_id}/confirm-received`);
    };

    const handleCreateShipment = (e) => {
        e.preventDefault();
        Inertia.post(
            `/admin/orders/${order.order_id}/create-shipment`,
            { tracking_number: trackingNumber },
            {
                onSuccess: () => {
                    alert("Pengiriman berhasil dibuat!");
                    setTrackingNumber("");
                },
                onError: (errors) =>
                    alert(
                        "Gagal membuat pengiriman: " +
                            (errors.tracking_number || "Unknown error")
                    ),
            }
        );
    };

    const purchaseRequest = order.offer_price.purchase_request;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <Package size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Detail Pesanan #{order.order_id}
                    </h2>
                </div>
            }
        >
            <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gray-50 space-y-6">
                <OrderInfo order={order} purchaseRequest={purchaseRequest} />
                <PurchaseRequestDetails purchaseRequest={purchaseRequest} />
                {order.completed_photo_path && (
                    <PhotoSection
                        title="Hasil Pengerjaan"
                        photos={order.completed_photo_path}
                    />
                )}
                {order.status === "processing" && (
                    <UploadPhotoSection
                        title="Upload Hasil Pengerjaan"
                        photos={completedPhoto}
                        onPhotoChange={handleCompletedPhotoChange}
                        onRemovePhoto={handleRemoveCompletedPhoto}
                        onUpload={handleUploadCompletedPhoto}
                        buttonText="Upload Foto Hasil"
                    />
                )}
                {order.complains &&
                    order.complains.some(
                        (complain) => complain.revised_photo_path
                    ) && (
                        <PhotoSection
                            title="Foto Revisi"
                            complains={order.complains}
                            isRevision
                        />
                    )}
                {order.status === "customer_complain" &&
                    order.customer_confirmation === "rejected" && (
                        <UploadPhotoSection
                            title="Upload Foto Revisi"
                            photos={revisedPhoto}
                            onPhotoChange={handleRevisedPhotoChange}
                            onRemovePhoto={handleRemoveRevisedPhoto}
                            onUpload={handleUploadRevisedPhoto}
                            buttonText="Upload Foto Revisi"
                            complaint={
                                order.complains[order.complains.length - 1]
                                    .customer_feedback
                            }
                        />
                    )}
                {order.shipping && (
                    <ShippingInfo
                        shipping={order.shipping}
                        purchaseRequest={purchaseRequest}
                    />
                )}
                {order.status === "waiting_for_admin_confirmation" && (
                    <ConfirmReceived
                        shippingReceipt={order.shipping_receipt_customer}
                        shippingProof={order.shipping_proof_customer}
                        onConfirm={handleConfirmReceived}
                    />
                )}
                {order.status === "waiting_for_shipment" && (
                    <CreateShipment
                        trackingNumber={trackingNumber}
                        setTrackingNumber={setTrackingNumber}
                        onCreate={handleCreateShipment}
                    />
                )}
                {order.reviews && order.reviews.length > 0 && (
                    <ReviewSection reviews={order.reviews} />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
