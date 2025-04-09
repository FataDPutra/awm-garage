// resources/js/Pages/Customer/ShowCustomer.jsx
import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Package,
    Camera,
    ZoomIn,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import OrderInfo from "@/Components/OrderInfo";
import OfferDetails from "@/Components/OfferDetails";
import ActionSection from "@/Components/ActionSection";

export default function ShowCustomer() {
    const { purchaseRequest, auth } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [openSections, setOpenSections] = useState({
        photos: true,
        info: true,
        offer: true,
        actions: true,
    });

    const getTotalEstimatedDays = (estimationDays, etd) => {
        if (!estimationDays || !etd) return "Tidak tersedia";
        const minEtd = parseInt(etd.split("-")[0]);
        const maxEtd = parseInt(etd.split("-")[1] || etd.split("-")[0]);
        const days = parseInt(estimationDays);
        return `${days + minEtd} - ${days + maxEtd} hari`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(`/storage/${photo.replace(/\\/g, "")}`);
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    const toggleSection = (sectionId) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const sections = [
        {
            id: "photos",
            title: "Foto Barang",
            content: (
                <div className="flex flex-wrap gap-6">
                    {Array.isArray(purchaseRequest.photo_path) ? (
                        purchaseRequest.photo_path.map((photo, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={(e) => openPhoto(photo, e)}
                            >
                                <img
                                    src={`/storage/${photo.replace(/\\/g, "")}`}
                                    alt={`Foto ${index + 1}`}
                                    className="w-48 h-48 object-cover rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
                                    <ZoomIn size={24} className="text-white" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="relative group cursor-pointer"
                            onClick={(e) =>
                                openPhoto(purchaseRequest.photo_path, e)
                            }
                        >
                            <img
                                src={`/storage/${purchaseRequest.photo_path.replace(
                                    /\\/g,
                                    ""
                                )}`}
                                alt="Foto Barang"
                                className="w-full max-w-2xl object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
                                <ZoomIn size={24} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>
            ),
        },
        {
            id: "info",
            title: "Informasi Pesanan",
            component: OrderInfo,
            props: { purchaseRequest, formatCurrency },
        },
        {
            id: "offer",
            title: "Detail Penawaran",
            component: OfferDetails,
            props: { purchaseRequest, formatCurrency, getTotalEstimatedDays },
        },
        {
            id: "actions",
            title: "Aksi",
            component: ActionSection,
            props: { purchaseRequest },
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <Package size={28} className="text-blue-500 " />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Detail Pesanan Anda #{purchaseRequest.id}
                    </h2>
                </div>
            }
        >
            <Head title="Detail Pesanan" />
            <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto space-y-6">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-2xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full p-4 sm:p-6 flex justify-between items-center text-left"
                            >
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {section.title}
                                </h3>
                                {openSections[section.id] ? (
                                    <ChevronUp
                                        size={24}
                                        className="text-blue-500"
                                    />
                                ) : (
                                    <ChevronDown
                                        size={24}
                                        className="text-blue-500"
                                    />
                                )}
                            </button>
                            {openSections[section.id] && (
                                <div className="p-4 sm:p-6 border-t border-blue-100 animate-slide-down">
                                    {section.content ? (
                                        section.content
                                    ) : (
                                        <section.component {...section.props} />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Modal untuk foto ukuran penuh */}
                    {selectedPhoto && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-auto">
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
        </AuthenticatedLayout>
    );
}
