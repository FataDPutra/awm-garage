import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import {
    Clock,
    Send,
    DollarSign,
    Package,
    CheckCircle,
    XCircle,
    FileText,
    ZoomIn,
    X,
} from "lucide-react";

export default function CreateDP({
    offerPrice,
    purchaseRequest,
    midtransClientKey,
    snapToken,
    order,
    preferredActiveMenu,
}) {
    const { data, setData, post, errors } = useForm({
        offerprice_id: offerPrice.id,
        amount: offerPrice.dp_amount,
    });

    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Status configuration for purchaseRequest.status
    const statusConfig = {
        all: {
            label: "Semua",
            icon: <Clock size={16} className="text-gray-500" />,
            bgColor: "bg-gray-500",
        },
        pending: {
            label: "Menunggu Penawaran",
            icon: <Clock size={16} className="text-yellow-500" />,
            bgColor: "bg-yellow-500",
        },
        offer_sent: {
            label: "Penawaran Dikirim",
            icon: <Send size={16} className="text-blue-500" />,
            bgColor: "bg-blue-500",
        },
        waiting_for_dp: {
            label: "Menunggu Pembayaran DP",
            icon: <DollarSign size={16} className="text-orange-500" />,
            bgColor: "bg-orange-500",
        },
        processing: {
            label: "Sedang Diproses",
            icon: <Package size={16} className="text-indigo-500" />,
            bgColor: "bg-indigo-500",
        },
        done: {
            label: "Selesai",
            icon: <CheckCircle size={16} className="text-green-500" />,
            bgColor: "bg-green-500",
        },
        cancelled: {
            label: "Dibatalkan",
            icon: <XCircle size={16} className="text-red-500" />,
            bgColor: "bg-red-500",
        },
    };

    // Function to render purchaseRequest.status
    const renderPurchaseRequestStatus = (status) => {
        const config = statusConfig[status] || {
            label: status,
            bgColor: "bg-gray-400",
            icon: null,
        };
        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${config.bgColor}`}
            >
                {config.icon &&
                    React.cloneElement(config.icon, {
                        className: "mr-1 text-white",
                        size: 14,
                    })}
                {config.label}
            </span>
        );
    };

    // Function to render offerPrice.status
    const renderOfferPriceStatus = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="flex items-center text-yellow-600 font-medium">
                        <Clock size={16} className="mr-1" />
                        Menunggu Persetujuan
                    </span>
                );
            case "accepted":
                return (
                    <span className="flex items-center text-green-600 font-medium">
                        <CheckCircle size={16} className="mr-1" />
                        Diterima
                    </span>
                );
            case "rejected":
                return (
                    <span className="flex items-center text-red-600 font-medium">
                        <XCircle size={16} className="mr-1" />
                        Ditolak
                    </span>
                );
            default:
                return <span className="text-gray-600">{status}</span>;
        }
    };

    // Function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Function to calculate total estimated days
    const getTotalEstimatedDays = (estimationDays, etd) => {
        if (!estimationDays || !etd) return "Tidak tersedia";
        const minEtd = parseInt(etd.split("-")[0]);
        const maxEtd = parseInt(etd.split("-")[1] || etd.split("-")[0]);
        const days = parseInt(estimationDays);
        return `${days + minEtd} - ${days + maxEtd} hari`;
    };

    // Functions to handle photo modal
    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(`/storage/${photo.replace(/\\/g, "")}`);
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    useEffect(() => {
        if (snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    console.log("Payment success:", result);
                    window.location.href = route("orders-customer.index");
                },
                onPending: function (result) {
                    console.log("Payment pending:", result);
                },
                onError: function (result) {
                    console.error("Payment error:", result);
                },
                onClose: function () {
                    console.log("Payment popup closed");
                },
            });
        }
    }, [snapToken]);

    const submit = (e) => {
        e.preventDefault();
        post(`/payments/${data.offerprice_id}/payment-dp`, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout preferredActiveMenu={preferredActiveMenu}>
            <Head title="Pembayaran DP">
                <script
                    type="text/javascript"
                    // src="https://app.midtrans.com/snap/snap.js"
                    src="https://app.sandbox.midtrans.com/snap/snap.js"
                    data-client-key={midtransClientKey}
                ></script>
            </Head>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Pembayaran DP</h1>

                <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <FileText size={20} className="mr-2 text-blue-500" />
                        Detail Pemesanan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                        <p>
                            <strong>Deskripsi:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {purchaseRequest.description}
                            </span>
                        </p>
                        <p>
                            <strong>Berat:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {purchaseRequest.weight} kg
                            </span>
                        </p>
                        <p>
                            <strong>Ongkos Kirim Barang ke Admin:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {formatCurrency(
                                    purchaseRequest.shipping_cost_to_admin
                                )}
                            </span>
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 shadow-sm">
                                {renderPurchaseRequestStatus(
                                    purchaseRequest.status
                                )}
                            </span>
                        </p>
                    </div>
                    {purchaseRequest.photo_path && (
                        <div className="mt-4">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Foto Barang
                            </h3>
                            <div className="flex flex-wrap gap-6">
                                {Array.isArray(purchaseRequest.photo_path) ? (
                                    purchaseRequest.photo_path.map(
                                        (photo, index) => (
                                            <div
                                                key={index}
                                                className="relative group cursor-pointer"
                                                onClick={(e) =>
                                                    openPhoto(photo, e)
                                                }
                                            >
                                                <img
                                                    src={`/storage/${photo.replace(
                                                        /\\/g,
                                                        ""
                                                    )}`}
                                                    alt={`Foto ${index + 1}`}
                                                    className="w-48 h-48 object-cover rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
                                                    <ZoomIn
                                                        size={24}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div
                                        className="relative group cursor-pointer"
                                        onClick={(e) =>
                                            openPhoto(
                                                purchaseRequest.photo_path,
                                                e
                                            )
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
                                            <ZoomIn
                                                size={24}
                                                className="text-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <DollarSign size={20} className="mr-2 text-blue-500" />
                        Detail Penawaran
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                        <p>
                            <strong>Harga Layanan:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {formatCurrency(offerPrice.service_price)}
                            </span>
                        </p>
                        <p>
                            <strong>Jumlah DP:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {formatCurrency(offerPrice.dp_amount)}
                            </span>
                        </p>
                        <p>
                            <strong>Estimasi Pengerjaan:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {offerPrice.estimation_days} hari
                                {offerPrice.shipping_to_customer_details
                                    ?.etd && (
                                    <span className="text-gray-500">
                                        {" "}
                                        (Total:{" "}
                                        {getTotalEstimatedDays(
                                            offerPrice.estimation_days,
                                            offerPrice
                                                .shipping_to_customer_details
                                                .etd
                                        )}
                                        )
                                    </span>
                                )}
                            </span>
                        </p>
                        <p>
                            <strong>Biaya Kirim ke Pelanggan:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {formatCurrency(
                                    offerPrice.shipping_cost_to_customer
                                )}
                            </span>
                        </p>
                        <p>
                            <strong>Detail Pengiriman:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {offerPrice.shipping_to_customer_details
                                    ?.name || "Tidak ada"}{" "}
                                -{" "}
                                {offerPrice.shipping_to_customer_details
                                    ?.service || ""}
                            </span>
                        </p>
                        <p>
                            <strong>Total Harga:</strong>{" "}
                            <span className="font-bold text-gray-800 text-lg">
                                {formatCurrency(offerPrice.total_price)}
                            </span>
                        </p>
                        <p className="col-span-1 sm:col-span-2">
                            <strong>Status:</strong>{" "}
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 shadow-sm">
                                {renderOfferPriceStatus(offerPrice.status)}
                            </span>
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="mt-4 bg-white p-4 shadow rounded"
                >
                    <input
                        type="hidden"
                        name="offerprice_id"
                        value={data.offerprice_id}
                    />
                    <div className="mb-4">
                        <label className="block font-bold">
                            Jumlah DP (Rp)
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={formatCurrency(data.amount)}
                            disabled
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Bayar DP
                    </button>
                </form>

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
        </AuthenticatedLayout>
    );
}
