import React, { useState } from "react";
import { Upload, ZoomIn, X, MapPin } from "lucide-react";
import Compressor from "compressorjs";
import heic2any from "heic2any";

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

    // Deteksi browser Chrome
    const isChrome =
        /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);

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
            onError: (errors) => {
                console.error("Confirm shipment errors:", errors);
                alert(
                    "Gagal mengkonfirmasi pengiriman: " +
                        (errors.shipping_proof_customer ||
                            errors.shipping_receipt_customer ||
                            "Unknown error")
                );
            },
        });
    };

    const convertHeicToJpeg = async (file) => {
        try {
            console.log(
                `Mengkonversi ${file.name} dari HEIC/HEIF ke JPEG menggunakan heic2any`
            );
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8,
            });
            const convertedFile = new File(
                [convertedBlob],
                file.name.replace(/\.(heic|heif)$/i, ".jpg"),
                { type: "image/jpeg", lastModified: new Date().getTime() }
            );
            console.log(
                `Konversi berhasil: ${convertedFile.name}, ukuran: ${convertedFile.size} bytes`
            );
            return convertedFile;
        } catch (err) {
            console.error(
                `Gagal mengkonversi ${file.name} dengan heic2any:`,
                err
            );
            throw new Error(`Gagal mengkonversi ${file.name} ke JPEG.`);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/heic",
            "image/heif", // Tambahkan image/heif
        ];
        console.log(
            `File: ${file.name}, MIME type: ${file.type}, Size: ${file.size} bytes`
        );
        if (!validTypes.includes(file.type)) {
            console.warn(
                `File ${file.name} ditolak: MIME type ${file.type} tidak valid.`
            );
            alert(
                `File tidak valid. Hanya gambar (JPEG, PNG, JPG, GIF, HEIC, HEIF) yang diperbolehkan.`
            );
            return;
        }

        let processedFile = file;

        if (file.type === "image/heic" || file.type === "image/heif") {
            try {
                processedFile = await convertHeicToJpeg(file);
            } catch (err) {
                alert(
                    `Gagal memproses file ${file.name}. Jika menggunakan Chrome, konversi file HEIC ke JPEG secara manual menggunakan alat seperti Preview (Mac) atau konverter online.`
                );
                return;
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
                setData("shipping_proof_customer", compressedFile);
                setPreviewImage(URL.createObjectURL(compressedFile));
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
    };

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo);
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
            {/* Informasi Alamat Pengiriman */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
                <div className="flex items-start">
                    <MapPin size={20} className="text-blue-500 mr-2 mt-1" />
                    <div>
                        <p className="text-sm font-medium text-gray-800">
                            Mohon lakukan pengiriman barang ke alamat bengkel
                            AWM Garage:
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Jl. Mendut Raya, RT.4/RW.3, Kelurahan Candirejo,
                            Kecamatan Ungaran Barat, Kabupaten Semarang, Jawa
                            Tengah 50513
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Telp:</span>{" "}
                            089638892960
                        </p>
                    </div>
                </div>
            </div>
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
                            accept="image/jpeg,image/png,image/jpg,image/gif,image/heic,image/heif"
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
                                <br />
                                (jpg, png, gif, heic, heif)
                            </p>
                        </label>
                    </div>
                    {isChrome && (
                        <p className="text-sm text-yellow-600 mt-2">
                            Catatan: Chrome mungkin tidak mendukung file HEIC.
                            Jika gagal, konversi file HEIC ke JPEG menggunakan
                            alat seperti Preview (Mac) atau konverter online.
                        </p>
                    )}
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
