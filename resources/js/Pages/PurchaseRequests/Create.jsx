import React, { useState, useEffect, useCallback } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import axios from "axios";
import debounce from "lodash/debounce";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FileText, X, AlertTriangle } from "lucide-react";
import ServiceSelection from "@/Components/ServiceSelection";
import AdditionalOptions from "@/Components/AdditionalOptions";
import DescriptionInput from "@/Components/DescriptionInput";
import PhotoUpload from "@/Components/PhotoUpload";
import WeightInput from "@/Components/WeightInput";
import AddressSection from "@/Components/AddressSection";
import ShippingOptions from "@/Components/ShippingOptions";
import ShippingCost from "@/Components/ShippingCost";
import SubmitButton from "@/Components/SubmitButton";

export default function Create() {
    const { services, auth } = usePage().props;
    const { data, setData, post, errors, processing } = useForm({
        service_id: "",
        description: "",
        photos: [],
        weight: "",
        shipping_cost_to_admin: 0,
        shipping_to_admin_selection: null,
        source_use_account_address: true,
        source_address: {
            zip_code: auth.user?.zip_code || "",
            province_name: auth.user?.province_name || "",
            city_name: auth.user?.city_name || "",
            district_name: auth.user?.district_name || "",
            subdistrict_name: auth.user?.subdistrict_name || "",
            address: auth.user?.address || "",
            address_details: auth.user?.address_details || "",
        },
        destination_use_account_address: true,
        destination_address: {
            zip_code: auth.user?.zip_code || "",
            province_name: auth.user?.province_name || "",
            city_name: auth.user?.city_name || "",
            district_name: auth.user?.district_name || "",
            subdistrict_name: auth.user?.subdistrict_name || "",
            address: auth.user?.address || "",
            address_details: auth.user?.address_details || "",
        },
        shipping_to_customer_preference: null,
        additionals: [],
    });
    const [showLocationAlert, setShowLocationAlert] = useState(true);
    const [showProfileAlert, setShowProfileAlert] = useState(true);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingOptionsToAdmin, setShippingOptionsToAdmin] = useState([]);
    const [shippingOptionsToCustomer, setShippingOptionsToCustomer] = useState(
        []
    );
    const [sourceSearch, setSourceSearch] = useState("");
    const [destinationSearch, setDestinationSearch] = useState("");
    const [sourceLocations, setSourceLocations] = useState([]);
    const [destinationLocations, setDestinationLocations] = useState([]);
    const [formErrors, setFormErrors] = useState([]);
    const [availableAdditionals, setAvailableAdditionals] = useState([]);

    // Check if profile address data is incomplete
    const isProfileIncomplete =
        !auth.user?.address ||
        !auth.user?.zip_code ||
        !auth.user?.province_name ||
        !auth.user?.city_name ||
        !auth.user?.district_name ||
        !auth.user?.subdistrict_name ||
        !auth.user?.address_details;

    useEffect(() => {
        if (isProfileIncomplete) {
            setShowProfileAlert(true);
        } else {
            setShowProfileAlert(false);
        }
    }, [auth.user]);

    const resetAddress = (type) => {
        const accountAddress = {
            zip_code: auth.user?.zip_code || "",
            province_name: auth.user?.province_name || "",
            city_name: auth.user?.city_name || "",
            district_name: auth.user?.district_name || "",
            subdistrict_name: auth.user?.subdistrict_name || "",
            address: auth.user?.address || "",
            address_details: auth.user?.address_details || "",
        };
        setData(type, accountAddress);
        if (type === "source_address") {
            setSourceSearch("");
            setSourceLocations([]);
        } else {
            setDestinationSearch("");
            setDestinationLocations([]);
        }
    };

    useEffect(() => {
        if (data.service_id) {
            const selectedService = services.find(
                (service) => service.id === parseInt(data.service_id)
            );
            setAvailableAdditionals(selectedService?.additionals || []);
            setData("additionals", []);
        } else {
            setAvailableAdditionals([]);
            setData("additionals", []);
        }
    }, [data.service_id, services]);

    const fetchLocations = useCallback(
        debounce((searchValue, type) => {
            if (!searchValue || searchValue.length <= 2) {
                type === "source"
                    ? setSourceLocations([])
                    : setDestinationLocations([]);
                return;
            }
            axios
                .get(`/locations?search=${encodeURIComponent(searchValue)}`)
                .then((response) => {
                    type === "source"
                        ? setSourceLocations(response.data.data || [])
                        : setDestinationLocations(response.data.data || []);
                })
                .catch((error) => {
                    console.error(`Error fetching ${type} locations:`, error);
                    type === "source"
                        ? setSourceLocations([])
                        : setDestinationLocations([]);
                });
        }, 1000),
        []
    );

    useEffect(() => {
        fetchLocations(sourceSearch, "source");
    }, [sourceSearch]);

    useEffect(() => {
        fetchLocations(destinationSearch, "destination");
    }, [destinationSearch]);

    const handleLocationSelect = (type, location) => {
        console.log("Location selected:", { type, location });
        if (!location.zip_code) {
            alert(
                "Lokasi yang dipilih tidak memiliki kode pos. Silakan pilih lokasi lain."
            );
            return;
        }
        if (type === "source_address") {
            setData("source_use_account_address", false);
        } else if (type === "destination_address") {
            setData("destination_use_account_address", false);
        }

        setData(type, {
            province_name: location.province_name || "",
            city_name: location.city_name || "",
            district_name: location.district_name || "",
            subdistrict_name: location.subdistrict_name || "",
            zip_code: location.zip_code || "",
            address: location.label || "",
            address_details: "",
        });

        if (type === "source_address") {
            setSourceSearch(location.label || "");
            setSourceLocations([]);
        } else {
            setDestinationSearch(location.label || "");
            setDestinationLocations([]);
        }
    };

    const calculateShippingCostToAdmin = async (weight) => {
        if (!weight || weight <= 0 || weight > 999.99) return;
        setIsCalculatingShipping(true);
        try {
            const payload = {
                weight: weight * 1000,
                use_account_address: data.source_use_account_address,
                new_address: !data.source_use_account_address
                    ? { zip_code: data.source_address.zip_code }
                    : null,
            };
            console.log("Calculating shipping to admin with payload:", payload);
            const response = await axios.post("/calculate-shipping", payload);
            setShippingOptionsToAdmin(response.data.costs || []);
            if (response.data.costs && response.data.costs.length > 0) {
                setData({
                    ...data,
                    shipping_cost_to_admin: response.data.costs[0].cost,
                    shipping_to_admin_selection: response.data.costs[0],
                });
            }
        } catch (error) {
            console.error(
                "Error calculating shipping cost to admin:",
                error.response?.data || error.message
            );
            setShippingOptionsToAdmin([]);
            setData({
                ...data,
                shipping_cost_to_admin: 0,
                shipping_to_admin_selection: null,
            });
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const calculateShippingCostToCustomer = async (weight) => {
        if (!weight || weight <= 0 || weight > 999.99) return;
        const destinationZipCode = data.destination_use_account_address
            ? auth.user?.zip_code
            : data.destination_address.zip_code;
        if (!destinationZipCode) {
            console.log(
                "No destination zip code available, skipping calculation."
            );
            return;
        }
        setIsCalculatingShipping(true);
        try {
            const adminResponse = await axios.get("/api/admin-zip-code");
            const originZipCode = adminResponse.data.zip_code;
            const payload = {
                weight: weight * 1000,
                destination: destinationZipCode,
                origin: originZipCode,
            };
            console.log(
                "Calculating shipping to customer with payload:",
                payload
            );
            const response = await axios.post(
                "/calculate-shipping-to-customer",
                payload
            );
            setShippingOptionsToCustomer(response.data.costs || []);
            if (response.data.costs && response.data.costs.length > 0) {
                setData({
                    ...data,
                    shipping_to_customer_preference: response.data.costs[0],
                });
            }
        } catch (error) {
            console.error(
                "Error calculating shipping cost to customer:",
                error.response?.data || error.message
            );
            setShippingOptionsToCustomer([]);
            setData({ ...data, shipping_to_customer_preference: null });
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    useEffect(() => {
        console.log("useEffect triggered for shipping calculation", {
            weight: data.weight,
            source_use_account_address: data.source_use_account_address,
            source_zip_code: data.source_address.zip_code,
            destination_use_account_address:
                data.destination_use_account_address,
            destination_zip_code: data.destination_address.zip_code,
            auth_user_zip_code: auth.user?.zip_code,
        });

        if (
            data.weight &&
            data.source_use_account_address &&
            auth.user?.zip_code
        ) {
            calculateShippingCostToAdmin(data.weight);
        } else if (data.weight && data.source_address.zip_code) {
            calculateShippingCostToAdmin(data.weight);
        }

        if (
            data.weight &&
            data.destination_use_account_address &&
            auth.user?.zip_code
        ) {
            calculateShippingCostToCustomer(data.weight);
        } else if (data.weight && data.destination_address.zip_code) {
            calculateShippingCostToCustomer(data.weight);
        }
    }, [
        data.weight,
        data.source_use_account_address,
        data.source_address.zip_code,
        data.destination_use_account_address,
        data.destination_address.zip_code,
        auth.user?.zip_code,
    ]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) => {
            const isValidType = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
            ].includes(file.type);
            return isValidType;
        });
        const newPhotos = [...data.photos, ...validFiles];
        setData("photos", newPhotos);
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPhotoPreviews([...photoPreviews, ...newPreviews]);
    };

    const handleRemovePhoto = (index) => {
        const updatedPhotos = data.photos.filter((_, i) => i !== index);
        const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
        setData("photos", updatedPhotos);
        setPhotoPreviews(updatedPreviews);
    };

    const handleAddressChange = (type, field, value) => {
        setData(type, { ...data[type], [field]: value });
    };

    const handleShippingOptionChange = (type, e) => {
        const [code, service] = e.target.value.split("|");
        const selectedOption = (
            type === "to_admin"
                ? shippingOptionsToAdmin
                : shippingOptionsToCustomer
        ).find((opt) => opt.code === code && opt.service === service);
        if (type === "to_admin") {
            setData({
                ...data,
                shipping_cost_to_admin: selectedOption
                    ? selectedOption.cost
                    : 0,
                shipping_to_admin_selection: selectedOption || null,
            });
        } else {
            setData({
                ...data,
                shipping_to_customer_preference: selectedOption || null,
            });
        }
    };

    const handleAdditionalChange = (e) => {
        const additionalId = parseInt(e.target.value);
        const isChecked = e.target.checked;
        if (isChecked) {
            const selectedAdditional = availableAdditionals.find(
                (add) => add.id === additionalId
            );
            if (selectedAdditional) {
                setData("additionals", [
                    ...data.additionals,
                    { id: selectedAdditional.id },
                ]);
            }
        } else {
            setData(
                "additionals",
                data.additionals.filter((add) => add.id !== additionalId)
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isProfileIncomplete) {
            setShowProfileAlert(true);
            return;
        }
        const formData = new FormData();
        formData.append("service_id", data.service_id);
        formData.append("description", data.description);
        formData.append("weight", data.weight);
        formData.append("shipping_cost_to_admin", data.shipping_cost_to_admin);
        formData.append(
            "shipping_to_admin_selection",
            JSON.stringify(data.shipping_to_admin_selection)
        );
        formData.append(
            "source_use_account_address",
            data.source_use_account_address ? 1 : 0
        );
        formData.append(
            "destination_use_account_address",
            data.destination_use_account_address ? 1 : 0
        );
        formData.append(
            "shipping_to_customer_preference",
            JSON.stringify(data.shipping_to_customer_preference)
        );

        const accountAddress = {
            zip_code: auth.user?.zip_code || "",
            province_name: auth.user?.province_name || "",
            city_name: auth.user?.city_name || "",
            district_name: auth.user?.district_name || "",
            subdistrict_name: auth.user?.subdistrict_name || "",
            address: auth.user?.address || "",
            address_details: auth.user?.address_details || "",
        };

        if (data.source_use_account_address) {
            Object.entries(accountAddress).forEach(([key, value]) => {
                formData.append(`source_address[${key}]`, value);
            });
        } else {
            Object.entries(data.source_address).forEach(([key, value]) => {
                formData.append(`source_address[${key}]`, value || "");
            });
        }

        if (data.destination_use_account_address) {
            Object.entries(accountAddress).forEach(([key, value]) => {
                formData.append(`destination_address[${key}]`, value);
            });
        } else {
            Object.entries(data.destination_address).forEach(([key, value]) => {
                formData.append(`destination_address[${key}]`, value || "");
            });
        }

        data.photos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo);
        });
        data.additionals.forEach((add, index) => {
            formData.append(`additionals[${index}][id]`, add.id);
        });

        post(route("purchase_requests.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => alert("Pesanan berhasil dibuat!"),
            onError: (errors) => {
                setFormErrors(errors);
                alert("Gagal membuat pesanan. Silakan periksa input Anda.");
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <FileText size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Buat Pemesanan
                    </h2>
                </div>
            }
        >
            <Head title="Buat Pesanan" />
            {/* Profile Incomplete Alert */}
            {showProfileAlert && isProfileIncomplete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-pulse">
                        <div className="p-6 relative">
                            <button
                                onClick={() => setShowProfileAlert(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-yellow-100 p-3 rounded-full mb-4">
                                    <AlertTriangle
                                        size={48}
                                        className="text-yellow-600"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Data Profil Belum Lengkap
                                </h3>
                                <div className="text-gray-600 mb-6 space-y-2">
                                    <p>
                                        Mohon lengkapi data alamat Anda di
                                        profil sebelum melakukan pemesanan.
                                    </p>
                                </div>
                                <Link
                                    href={route("profile.edit")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                                >
                                    Ke Halaman Profil
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Jawa Tengah Location Alert */}
            {!showProfileAlert && showLocationAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-pulse">
                        <div className="p-6 relative">
                            <button
                                onClick={() => setShowLocationAlert(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-yellow-100 p-3 rounded-full mb-4">
                                    <AlertTriangle
                                        size={48}
                                        className="text-yellow-600"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Informasi Penting
                                </h3>
                                <div className="text-gray-600 mb-6 space-y-2">
                                    <p>
                                        Bengkel kami berlokasi di{" "}
                                        <span className="font-semibold text-blue-600">
                                            Jawa Tengah
                                        </span>
                                        .
                                    </p>
                                    <p>
                                        Pemesanan dari luar Jawa Tengah mungkin
                                        dikenakan biaya pengiriman yang lebih
                                        tinggi.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowLocationAlert(false)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                                >
                                    Mengerti, Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto px-4 py-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-6 space-y-6"
                    encType="multipart/form-data"
                >
                    <ServiceSelection
                        services={services}
                        data={data}
                        setData={setData}
                        formErrors={formErrors}
                    />
                    <AdditionalOptions
                        availableAdditionals={availableAdditionals}
                        data={data}
                        setData={setData}
                        formErrors={formErrors}
                        handleAdditionalChange={handleAdditionalChange}
                    />
                    <DescriptionInput
                        data={data}
                        setData={setData}
                        formErrors={formErrors}
                    />
                    <PhotoUpload
                        data={data}
                        setData={setData}
                        photoPreviews={photoPreviews}
                        setPhotoPreviews={setPhotoPreviews}
                        formErrors={formErrors}
                        handleFileChange={handleFileChange}
                        handleRemovePhoto={handleRemovePhoto}
                    />
                    <WeightInput
                        data={data}
                        setData={setData}
                        formErrors={formErrors}
                    />
                    <AddressSection
                        type="source_address"
                        label="Dari Mana Anda Mengirim?"
                        data={data}
                        setData={setData}
                        search={sourceSearch}
                        setSearch={setSourceSearch}
                        locations={sourceLocations}
                        setLocations={setSourceLocations}
                        formErrors={formErrors}
                        handleLocationSelect={handleLocationSelect}
                        handleAddressChange={handleAddressChange}
                        resetAddress={resetAddress}
                    />
                    <ShippingOptions
                        label="Opsi Pengiriman ke Admin"
                        type="shipping_to_admin_selection"
                        data={data}
                        shippingOptions={shippingOptionsToAdmin}
                        handleShippingOptionChange={handleShippingOptionChange}
                        isCalculatingShipping={isCalculatingShipping}
                        formErrors={formErrors}
                    />
                    <ShippingCost data={data} />
                    <AddressSection
                        type="destination_address"
                        label="Kirim Ke Mana Setelah Selesai?"
                        data={data}
                        setData={setData}
                        search={destinationSearch}
                        setSearch={setDestinationSearch}
                        locations={destinationLocations}
                        setLocations={setDestinationLocations}
                        formErrors={formErrors}
                        handleLocationSelect={handleLocationSelect}
                        handleAddressChange={handleAddressChange}
                        resetAddress={resetAddress}
                    />
                    <ShippingOptions
                        label="Preferensi Pengiriman ke Pelanggan"
                        type="shipping_to_customer_preference"
                        data={data}
                        shippingOptions={shippingOptionsToCustomer}
                        handleShippingOptionChange={handleShippingOptionChange}
                        isCalculatingShipping={isCalculatingShipping}
                        formErrors={formErrors}
                    />
                    <SubmitButton
                        processing={processing}
                        isCalculatingShipping={isCalculatingShipping}
                    />
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
