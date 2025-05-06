import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Paintbrush, ZoomIn, X } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ServiceDetail({
    service,
    additionalTypes,
    completedPhotos,
}) {
    const { auth } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Fungsi untuk mencari nama tipe berdasarkan additional_type_id
    const getTypeName = (additional_type_id) => {
        const type = additionalTypes.find((t) => t.id === additional_type_id);
        return type?.name || "Tidak dikategorikan";
    };

    // Fungsi untuk membuka dan menutup modal foto
    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo);
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
                    <h2 className="text-3xl font-bold text-blue-600 flex items-center">
                        <Paintbrush
                            size={28}
                            className="mr-2 animate-bounce-subtle"
                        />
                        Detail Layanan: {service.service_name}
                    </h2>
                </div>
            }
        >
            <div className="min-h-screen bg-blue-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="animate-fade-in">
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-6">
                            {/* Informasi Utama */}
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                                {service.service_name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {service.description ||
                                    "Tidak ada deskripsi tersedia."}
                            </p>
                            <p className="text-gray-800 font-semibold mb-6">
                                Harga Dasar: Rp{" "}
                                {service.base_price.toLocaleString("id-ID")}
                            </p>

                            {/* Tombol Aksi */}
                            <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
                                <Link
                                    href={route("purchase-requests.create")}
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 text-center"
                                >
                                    Pesan Sekarang
                                </Link>
                                <Link
                                    href={route("customer.services")}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 text-center"
                                >
                                    Kembali
                                </Link>
                            </div>

                            {/* Opsi Tambahan */}
                            {service.additionals?.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                                        Opsi Tambahan:
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {service.additionals.map(
                                            (additional) => {
                                                console.log(
                                                    "Additional data:",
                                                    {
                                                        id: additional.id,
                                                        name: additional.name,
                                                        additional_type_id:
                                                            additional.additional_type_id,
                                                        additionalType:
                                                            additional.additionalType,
                                                    }
                                                );
                                                return (
                                                    <li
                                                        key={additional.id}
                                                        className="border rounded-lg p-4 bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {additional.image_path ? (
                                                                <div
                                                                    className="relative group cursor-pointer"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        openPhoto(
                                                                            `/storage/${additional.image_path}`,
                                                                            e
                                                                        )
                                                                    }
                                                                >
                                                                    <img
                                                                        src={`/storage/${additional.image_path}`}
                                                                        alt={
                                                                            additional.name
                                                                        }
                                                                        className="w-24 h-24 object-cover rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
                                                                        <ZoomIn
                                                                            size={
                                                                                24
                                                                            }
                                                                            className="text-white"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg">
                                                                    <Paintbrush
                                                                        size={
                                                                            24
                                                                        }
                                                                        className="text-gray-400"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h5 className="font-semibold text-gray-800">
                                                                    {
                                                                        additional.name
                                                                    }
                                                                </h5>
                                                                <p className="text-gray-600">
                                                                    Tipe:{" "}
                                                                    {getTypeName(
                                                                        additional.additional_type_id
                                                                    ) ||
                                                                        additional
                                                                            .additionalType
                                                                            ?.name ||
                                                                        "Tidak dikategorikan"}
                                                                </p>
                                                                <p className="text-gray-800 font-semibold">
                                                                    +Rp{" "}
                                                                    {additional.additional_price.toLocaleString(
                                                                        "id-ID"
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Galeri Hasil Pengerjaan */}
                            {completedPhotos.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                                        Galeri Hasil Pengerjaan:
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {completedPhotos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="relative group cursor-pointer"
                                                onClick={(e) =>
                                                    openPhoto(
                                                        `/storage/${photo}`,
                                                        e
                                                    )
                                                }
                                            >
                                                <img
                                                    src={`/storage/${photo}`}
                                                    alt={`Hasil pengerjaan ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-48 object-cover rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
                                                    <ZoomIn
                                                        size={24}
                                                        className="text-white"
                                                    />
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
