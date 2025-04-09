// resources/js/Pages/Admin/PurchaseRequests/Show.jsx
import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    FileText,
    Camera,
    ZoomIn,
    X,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import OrderInfo from "@/Components/OrderInfo";
import OfferForm from "@/Components/Admin/PurchaseRequest/OfferForm";
import OfferDetails from "@/Components/Admin/PurchaseRequest/OfferDetails";

export default function Show() {
    const { purchaseRequest, auth } = usePage().props;
    const [isEditingOffer, setIsEditingOffer] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [openSections, setOpenSections] = useState({
        photos: true,
        info: true,
    });

    const { data, setData, post, put, errors, processing } = useForm({
        service_price: isEditingOffer
            ? purchaseRequest.offer_price?.service_price || ""
            : "",
        dp_amount: isEditingOffer
            ? purchaseRequest.offer_price?.dp_amount || ""
            : "",
        estimation_days: isEditingOffer
            ? purchaseRequest.offer_price?.estimation_days || ""
            : "",
        shipping_cost_to_customer: isEditingOffer
            ? purchaseRequest.offer_price?.shipping_cost_to_customer || 0
            : purchaseRequest.shipping_to_customer_preference?.cost || 0,
        shipping_to_customer_selection: isEditingOffer
            ? purchaseRequest.offer_price?.shipping_to_customer_details || null
            : purchaseRequest.shipping_to_customer_preference || null,
        total_price: isEditingOffer
            ? purchaseRequest.offer_price?.total_price || ""
            : "",
        pr_id: purchaseRequest.id,
    });

    const [shippingOptionsToCustomer, setShippingOptionsToCustomer] = useState(
        []
    );
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingError, setShippingError] = useState(null);

    const calculateShippingCostToCustomer = async (weight) => {
        if (!weight || weight <= 0 || isNaN(weight)) {
            setShippingError("Nilai berat tidak valid");
            return;
        }

        const destinationZipCode =
            purchaseRequest.destination_address?.zip_code;
        if (!destinationZipCode) {
            setShippingError("Kode pos tujuan tidak tersedia");
            return;
        }

        setIsCalculatingShipping(true);
        setShippingError(null);
        try {
            const adminResponse = await axios.get("/api/admin-zip-code");
            const originZipCode = adminResponse.data.zip_code;

            const response = await axios.post(
                "/calculate-shipping-to-customer",
                {
                    weight: weight * 1000,
                    destination: destinationZipCode,
                    origin: originZipCode,
                }
            );
            const costs = response.data.costs || [];
            setShippingOptionsToCustomer(costs);
            if (costs.length > 0) {
                const preferred =
                    costs.find(
                        (opt) =>
                            opt.code ===
                                (isEditingOffer
                                    ? purchaseRequest.offer_price
                                          ?.shipping_to_customer_details?.code
                                    : purchaseRequest
                                          .shipping_to_customer_preference
                                          ?.code) &&
                            opt.service ===
                                (isEditingOffer
                                    ? purchaseRequest.offer_price
                                          ?.shipping_to_customer_details
                                          ?.service
                                    : purchaseRequest
                                          .shipping_to_customer_preference
                                          ?.service)
                    ) || costs[0];
                setData({
                    ...data,
                    shipping_cost_to_customer: preferred.cost,
                    shipping_to_customer_selection: preferred,
                    total_price: data.service_price
                        ? (
                              parseFloat(data.service_price) + preferred.cost
                          ).toString()
                        : preferred.cost.toString(),
                });
            } else {
                setShippingError("Tidak ada opsi pengiriman tersedia");
            }
        } catch (error) {
            setShippingError(
                error.response?.data?.error || "Gagal mengambil opsi pengiriman"
            );
            setShippingOptionsToCustomer([]);
            setData({
                ...data,
                shipping_cost_to_customer: 0,
                shipping_to_customer_selection: null,
                total_price: "",
            });
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    useEffect(() => {
        if (purchaseRequest.weight) {
            calculateShippingCostToCustomer(purchaseRequest.weight);
        } else {
            setShippingError("Berat tidak tersedia dalam permintaan");
        }
    }, [purchaseRequest.weight]);

    useEffect(() => {
        if (data.service_price) {
            const servicePrice = parseFloat(data.service_price);
            const dpAmount = (servicePrice * 0.5).toFixed(2);
            const totalPrice =
                servicePrice + parseFloat(data.shipping_cost_to_customer || 0);
            setData({
                ...data,
                dp_amount: dpAmount,
                total_price: totalPrice.toFixed(2),
            });
        }
    }, [data.service_price, data.shipping_cost_to_customer]);

    const handleShippingOptionChange = (e) => {
        const [code, service] = e.target.value.split("|");
        const selectedOption = shippingOptionsToCustomer.find(
            (opt) => opt.code === code && opt.service === service
        );
        setData({
            ...data,
            shipping_cost_to_customer: selectedOption ? selectedOption.cost : 0,
            shipping_to_customer_selection: selectedOption || null,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditingOffer) {
            put(
                route(
                    "admin.purchaserequests.update_offer",
                    purchaseRequest.id
                ),
                {
                    onSuccess: () => {
                        alert("Penawaran berhasil diperbarui!");
                        setIsEditingOffer(false);
                    },
                    onError: () =>
                        alert(
                            "Gagal memperbarui penawaran. Periksa input Anda."
                        ),
                }
            );
        } else {
            post(route("admin.purchaserequests.offer", purchaseRequest.id), {
                onSuccess: () => alert("Penawaran berhasil dikirim!"),
                onError: () =>
                    alert("Gagal mengirim penawaran. Periksa input Anda."),
            });
        }
    };

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
            title: "Informasi Permintaan",
            component: OrderInfo,
            props: { purchaseRequest, formatCurrency },
        },
        {
            id: "offer",
            title:
                purchaseRequest.offer_price && !isEditingOffer
                    ? "Detail Penawaran"
                    : "Buat/Edit Penawaran",
            component:
                purchaseRequest.offer_price && !isEditingOffer
                    ? OfferDetails
                    : OfferForm,
            props:
                purchaseRequest.offer_price && !isEditingOffer
                    ? {
                          purchaseRequest,
                          setIsEditingOffer,
                          getTotalEstimatedDays,
                          formatCurrency,
                      }
                    : {
                          purchaseRequest,
                          data,
                          setData,
                          errors,
                          processing,
                          isEditingOffer,
                          shippingOptionsToCustomer,
                          isCalculatingShipping,
                          shippingError,
                          handleShippingOptionChange,
                          handleSubmit,
                          setIsEditingOffer,
                          getTotalEstimatedDays,
                          formatCurrency,
                      },
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <FileText size={28} className="text-blue-500 " />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Detail Pemesanan #{purchaseRequest.id}
                    </h2>
                </div>
            }
        >
            <Head title="Detail Permintaan" />
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
