import React, { useState, useEffect, useCallback } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import debounce from "lodash/debounce";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { FileText } from "lucide-react";
import ServiceSelection from "@/Components/ServiceSelection";
import AdditionalOptions from "@/Components/AdditionalOptions";
import DescriptionInput from "@/Components/DescriptionInput";
import PhotoUpload from "@/Components/PhotoUpload";
import WeightInput from "@/Components/WeightInput";
import AddressSection from "@/Components/AddressSection";
import ShippingOptions from "@/Components/ShippingOptions";
import ShippingCost from "@/Components/ShippingCost";
import EditSubmitButton from "@/Components/EditSubmitButton";

export default function Edit() {
    const { services, auth, purchaseRequest } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        service_id: purchaseRequest.service_id || "",
        description: purchaseRequest.description || "",
        photos: [],
        weight: purchaseRequest.weight || "",
        shipping_cost_to_admin: purchaseRequest.shipping_cost_to_admin || 0,
        shipping_to_admin_selection:
            purchaseRequest.shipping_to_admin_details || null,
        source_use_account_address:
            purchaseRequest.source_address.address === auth.user?.address,
        source_address: {
            zip_code:
                purchaseRequest.source_address.zip_code ||
                auth.user?.zip_code ||
                "",
            province_name:
                purchaseRequest.source_address.province_name ||
                auth.user?.province_name ||
                "",
            city_name:
                purchaseRequest.source_address.city_name ||
                auth.user?.city_name ||
                "",
            district_name:
                purchaseRequest.source_address.district_name ||
                auth.user?.district_name ||
                "",
            subdistrict_name:
                purchaseRequest.source_address.subdistrict_name ||
                auth.user?.subdistrict_name ||
                "",
            address:
                purchaseRequest.source_address.address ||
                auth.user?.address ||
                "",
            address_details:
                purchaseRequest.source_address.address_details ||
                auth.user?.address_details ||
                "",
        },
        destination_use_account_address:
            purchaseRequest.destination_address.address === auth.user?.address,
        destination_address: {
            zip_code:
                purchaseRequest.destination_address.zip_code ||
                auth.user?.zip_code ||
                "",
            province_name:
                purchaseRequest.destination_address.province_name ||
                auth.user?.province_name ||
                "",
            city_name:
                purchaseRequest.destination_address.city_name ||
                auth.user?.city_name ||
                "",
            district_name:
                purchaseRequest.destination_address.district_name ||
                auth.user?.district_name ||
                "",
            subdistrict_name:
                purchaseRequest.destination_address.subdistrict_name ||
                auth.user?.subdistrict_name ||
                "",
            address:
                purchaseRequest.destination_address.address ||
                auth.user?.address ||
                "",
            address_details:
                purchaseRequest.destination_address.address_details ||
                auth.user?.address_details ||
                "",
        },
        shipping_to_customer_preference:
            purchaseRequest.shipping_to_customer_preference || null,
        additionals:
            purchaseRequest.additional_details?.map((add) => ({
                id: add.id,
            })) || [],
    });

    const [photoPreviews, setPhotoPreviews] = useState(
        purchaseRequest.photos?.map((path) => `/photos/${path}`) || []
    );
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
    const [shippingError, setShippingError] = useState(null);

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
        if (
            (data.source_use_account_address ||
                data.destination_use_account_address) &&
            !auth.user?.zip_code
        ) {
            alert(
                "Mohon perbarui profil Anda dengan kode pos yang valid untuk menggunakan alamat akun."
            );
        }
    }, [
        data.source_use_account_address,
        data.destination_use_account_address,
        auth.user,
    ]);

    useEffect(() => {
        if (data.service_id) {
            const selectedService = services.find(
                (service) => service.id === parseInt(data.service_id)
            );
            setAvailableAdditionals(selectedService?.additionals || []);
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
                    console.error(`Error fetching ${type} search:`, error);
                    type === "source"
                        ? setSourceLocations([])
                        : setDestinationLocations([]);
                });
        }, 500),
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
                "Lokasi yang dipilih tidak memiliki kode pos valid. Silakan pilih lokasi lain."
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
        if (!weight || isNaN(weight) || weight <= 0 || weight > 999.99) {
            console.log("Invalid weight for shipping calculation:", weight);
            setShippingError(
                "Berat barang tidak valid. Harap masukkan berat antara 0.01 dan 999.99 kg."
            );
            return;
        }
        const zipCode = data.source_use_account_address
            ? auth.user?.zip_code
            : data.source_address.zip_code;
        if (!zipCode || !/^\d+$/.test(zipCode)) {
            console.log("Invalid ZIP code for shipping calculation:", zipCode);
            setShippingError(
                "Kode pos tidak valid. Silakan pilih alamat dengan kode pos yang benar."
            );
            return;
        }
        setIsCalculatingShipping(true);
        setShippingError(null);
        try {
            const payload = {
                weight: Number(weight) * 1000,
                use_account_address: data.source_use_account_address,
                new_address: !data.source_use_account_address
                    ? { zip_code: zipCode }
                    : null,
            };
            console.log("Sending payload to /calculate-shipping:", payload);
            const response = await axios.post("/calculate-shipping", payload);
            console.log("Response from /calculate-shipping:", response.data);
            setShippingOptionsToAdmin(response.data.costs || []);
            if (response.data.costs && response.data.costs.length > 0) {
                setData({
                    ...data,
                    shipping_cost_to_admin: response.data.costs[0].cost,
                    shipping_to_admin_selection: response.data.costs[0],
                });
            } else {
                setShippingError(
                    "Tidak ada opsi pengiriman tersedia untuk alamat ini."
                );
            }
        } catch (error) {
            console.error("Error calculating shipping cost to admin:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setShippingOptionsToAdmin([]);
            setData({
                ...data,
                shipping_cost_to_admin: 0,
                shipping_to_admin_selection: null,
            });
            setShippingError(
                error.response?.data?.message ||
                    "Gagal menghitung biaya pengiriman. Pastikan kode pos dan berat barang valid."
            );
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    const calculateShippingCostToCustomer = async (weight) => {
        if (!weight || isNaN(weight) || weight <= 0 || weight > 999.99) {
            console.log("Invalid weight for shipping:", weight);
            setShippingError(
                "Berat barang tidak valid. Harus antara 0.01 dan 999.99 kg."
            );
            return;
        }
        const destinationZipCode = data.destination_use_account_address
            ? auth.user?.zip_code
            : data.destination_address.zip_code;
        if (!destinationZipCode || !/^\d+$/.test(destinationZipCode)) {
            console.log("Invalid destination ZIP code:", destinationZipCode);
            setShippingError(
                "Kode pos tujuan tidak valid. Silakan pilih alamat yang valid."
            );
            return;
        }
        setIsCalculatingShipping(true);
        setShippingError(null);
        try {
            const adminResponse = await axios.get("/api/admin-zip-code");
            const originZipCode = adminResponse.data.zip_code;
            const payload = {
                weight: Number(weight) * 1000,
                destination: destinationZipCode,
                origin: originZipCode,
            };
            console.log(
                "Sending payload to /calculate-shipping-to-customer:",
                payload
            );
            const response = await axios.post(
                "/calculate-shipping-to-customer",
                payload
            );
            console.log(
                "Response from /calculate-shipping-to-customer:",
                response.data
            );
            setShippingOptionsToCustomer(response.data.costs || []);
            if (response.data.costs && response.data.costs.length > 0) {
                setData({
                    ...data,
                    shipping_to_customer_preference: response.data.costs[0],
                });
            } else {
                setShippingError(
                    "Tidak ada opsi pengiriman tersedia untuk alamat tujuan ini."
                );
            }
        } catch (error) {
            console.error("Error calculating shipping cost to customer:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            setShippingOptionsToCustomer([]);
            setData({ ...data, shipping_to_customer_preference: null });
            setShippingError(
                error.response?.data?.message ||
                    "Gagal menghitung biaya pengiriman ke pelanggan. Pastikan kode pos valid."
            );
        } finally {
            setIsCalculatingShipping(false);
        }
    };

    useEffect(() => {
        console.log("useEffect triggered for shipping calculation:", {
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
        )?.find((opt) => opt.code === code && opt.service === service);
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
        const formData = new FormData();
        formData.append("_method", "PUT");
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

        const sourceAddress = data.source_use_account_address
            ? {
                  zip_code: auth.user?.zip_code || "",
                  province_name: auth.user?.province_name || "",
                  city_name: auth.user?.city_name || "",
                  district_name: auth.user?.district_name || "",
                  subdistrict_name: auth.user?.subdistrict_name || "",
                  address: auth.user?.address || "",
                  address_details: auth.user?.address_details || "",
              }
            : data.source_address;

        const destinationAddress = data.destination_use_account_address
            ? {
                  zip_code: auth.user?.zip_code || "",
                  province_name: auth.user?.province_name || "",
                  city_name: auth.user?.city_name || "",
                  district_name: auth.user?.district_name || "",
                  subdistrict_name: auth.user?.subdistrict_name || "",
                  address: auth.user?.address || "",
                  address_details: auth.user?.address_details || "",
              }
            : data.destination_address;

        Object.entries(sourceAddress).forEach(([key, value]) => {
            formData.append(`source_address[${key}]`, value || "");
        });
        Object.entries(destinationAddress).forEach(([key, value]) => {
            formData.append(`destination_address[${key}]`, value || "");
        });

        data.photos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo);
        });

        data.additionals.forEach((add, index) => {
            formData.append(`additionals[${index}][id]`, add.id);
        });

        post(route("purchase_requests.update", purchaseRequest.id), {
            data: formData,
            forceFormData: true,
            onSuccess: () => alert("Permintaan pembelian berhasil diperbarui!"),
            onError: (errors) => {
                setFormErrors(errors);
                alert(
                    "Gagal memperbarui permintaan pembelian. Silakan periksa input Anda."
                );
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3 animate-pulse">
                    <FileText size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-bold text-blue-600">
                        Edit Pemesanan
                    </h2>
                </div>
            }
        >
            <Head title="Edit Permintaan Pembelian" />
            <div className="container mx-auto px-4 py-6">
                {shippingError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span>{shippingError}</span>
                    </div>
                )}
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
                    <EditSubmitButton
                        processing={processing}
                        isCalculatingShipping={isCalculatingShipping}
                    />
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
