import React, { useState } from "react";
import Compressor from "compressorjs";
import heic2any from "heic2any";
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
import ReviewSection from "@/Components/Admin/Orders/ReviewSection";

export default function Show() {
    const { order } = usePage().props;
    const [completedPhoto, setCompletedPhoto] = useState([]);
    const [revisedPhoto, setRevisedPhoto] = useState([]);
    const [trackingNumber, setTrackingNumber] = useState("");

    // Deteksi browser Chrome
    const isChrome =
        /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);

    const convertHeicToJpeg = async (file) => {
        try {
            console.log(
                `Mengonversi ${file.name} dari HEIC/HEIF ke JPEG menggunakan heic2any`
            );
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8,
            });
            const convertedFile = new File(
                [convertedBlob],
                file.name.replace(/\.heic$/i, ".jpg"),
                {
                    type: "image/jpeg",
                    lastModified: new Date().getTime(),
                }
            );
            console.log(
                `Konversi berhasil: ${convertedFile.name}, ukuran: ${convertedFile.size} bytes`
            );
            return convertedFile;
        } catch (err) {
            console.error(
                `Gagal mengonversi ${file.name} dengan heic2any:`,
                err
            );
            throw new Error(`Gagal mengonversi ${file.name} ke JPEG.`);
        }
    };

    // Actions for completed photos
    const handleCompletedPhotoChange = async (files) => {
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/heic",
            "image/heif",
        ];

        const validFiles = Array.from(files).filter((file) => {
            console.log(
                `File: ${file.name}, MIME type: ${file.type}, Size: ${file.size} bytes`
            );
            if (!validTypes.includes(file.type)) {
                console.warn(
                    `File ${file.name} ditolak: MIME type ${file.type} tidak valid.`
                );
                return false;
            }
            return true;
        });

        for (const file of validFiles) {
            let processedFile = file;

            if (file.type === "image/heic" || file.type === "image/heif") {
                try {
                    processedFile = await convertHeicToJpeg(file);
                } catch (err) {
                    alert(
                        `Gagal memproses file ${file.name}. Jika menggunakan Chrome, konversi file HEIC ke JPEG secara manual menggunakan alat seperti Preview (Mac) atau konverter online.`
                    );
                    continue;
                }
            }

            new Compressor(processedFile, {
                quality: 0.8,
                maxWidth: 1024,
                maxHeight: 1024,
                mimeType: "image/jpeg",
                success(compressedFile) {
                    console.log(
                        `File ${processedFile.name} berhasil dikompresi ke JPEG, ukuran: ${compressedFile.size} bytes`
                    );
                    const newPhoto = {
                        file: compressedFile,
                        preview: URL.createObjectURL(compressedFile),
                    };
                    setCompletedPhoto((prev) => [...prev, newPhoto]);
                },
                error(err) {
                    console.error(
                        `Gagal mengompresi file ${processedFile.name}:`,
                        err
                    );
                    alert(
                        `Gagal mengompresi file ${processedFile.name}: ${err.message}. Konversi file ke JPEG secara manual.`
                    );
                },
            });
        }

        if (validFiles.length !== files.length) {
            alert(
                "Beberapa file tidak valid. Hanya gambar (JPEG, PNG, JPG, GIF, HEIC, HEIF) yang diperbolehkan."
            );
        }
    };

    const handleRemoveCompletedPhoto = (index) => {
        console.log(`Menghapus foto pada indeks ${index}`);
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
    const handleRevisedPhotoChange = async (files) => {
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/heic",
            "image/heif",
        ];

        const validFiles = Array.from(files).filter((file) => {
            console.log(
                `File: ${file.name}, MIME type: ${file.type}, Size: ${file.size} bytes`
            );
            if (!validTypes.includes(file.type)) {
                console.warn(
                    `File ${file.name} ditolak: MIME type ${file.type} tidak valid.`
                );
                return false;
            }
            return true;
        });

        for (const file of validFiles) {
            let processedFile = file;

            if (file.type === "image/heic" || file.type === "image/heif") {
                try {
                    processedFile = await convertHeicToJpeg(file);
                } catch (err) {
                    alert(
                        `Gagal memproses file ${file.name}. Jika menggunakan Chrome, konversi file HEIC ke JPEG secara manual menggunakan alat seperti Preview (Mac) atau konverter online.`
                    );
                    continue;
                }
            }

            new Compressor(processedFile, {
                quality: 0.8,
                maxWidth: 1024,
                maxHeight: 1024,
                mimeType: "image/jpeg",
                success(compressedFile) {
                    console.log(
                        `File ${processedFile.name} berhasil dikompresi ke JPEG, ukuran: ${compressedFile.size} bytes`
                    );
                    const newPhoto = {
                        file: compressedFile,
                        preview: URL.createObjectURL(compressedFile),
                    };
                    setRevisedPhoto((prev) => [...prev, newPhoto]);
                },
                error(err) {
                    console.error(
                        `Gagal mengompresi file ${processedFile.name}:`,
                        err
                    );
                    alert(
                        `Gagal mengompresi file ${processedFile.name}: ${err.message}. Konversi file ke JPEG secara manual.`
                    );
                },
            });
        }

        if (validFiles.length !== files.length) {
            alert(
                "Beberapa file tidak valid. Hanya gambar (JPEG, PNG, JPG, GIF, HEIC, HEIF) yang diperbolehkan."
            );
        }
    };

    const handleRemoveRevisedPhoto = (index) => {
        console.log(`Menghapus foto revisi pada indeks ${index}`);
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
                    alert(
                        "Gagal mengunggah foto: " +
                            (errors.revised_photo || "Unknown error")
                    ),
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
                        isChrome={isChrome}
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
                            isChrome={isChrome}
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
