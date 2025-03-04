import React, { useState, useEffect, useCallback } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import debounce from "lodash/debounce";

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
        additionals: [], // Tambahkan field untuk additionals
    });

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
    const [formErrors, setFormErrors] = useState({});
    const [availableAdditionals, setAvailableAdditionals] = useState([]); // Additionals dari service yang dipilih

    const resetAddress = (type) => {
        const emptyAddress = {
            zip_code: "",
            province_name: "",
            city_name: "",
            district_name: "",
            subdistrict_name: "",
            address: "",
            address_details: "",
        };
        setData(type, emptyAddress);
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
                "Please update your profile with a valid postal code to use your account address."
            );
        }
    }, [
        data.source_use_account_address,
        data.destination_use_account_address,
        auth.user,
    ]);

    // Update availableAdditionals saat service_id berubah
    useEffect(() => {
        if (data.service_id) {
            const selectedService = services.find(
                (service) => service.id === parseInt(data.service_id)
            );
            setAvailableAdditionals(selectedService?.additionals || []);
            setData("additionals", []); // Reset additionals saat service berubah
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
            console.error("Destination ZIP code is missing");
            return;
        }

        setIsCalculatingShipping(true);
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
        if (
            data.weight &&
            (data.source_use_account_address || data.source_address.zip_code)
        ) {
            calculateShippingCostToAdmin(data.weight);
        }
        if (
            data.weight &&
            (data.destination_use_account_address ||
                data.destination_address.zip_code)
        ) {
            calculateShippingCostToCustomer(data.weight);
        }
    }, [
        data.weight,
        data.source_use_account_address,
        data.source_address.zip_code,
        data.destination_use_account_address,
        data.destination_address.zip_code,
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
            const isValidSize = file.size <= 2 * 1024 * 1024;
            return isValidType && isValidSize;
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
        setData(type, {
            ...data[type],
            [field]: value,
        });
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
        if (data.source_use_account_address) {
            Object.entries({
                zip_code: auth.user?.zip_code || "",
                province_name: auth.user?.province_name || "",
                city_name: auth.user?.city_name || "",
                district_name: auth.user?.district_name || "",
                subdistrict_name: auth.user?.subdistrict_name || "",
                address: auth.user?.address || "",
                address_details: auth.user?.address_details || "",
            }).forEach(([key, value]) => {
                formData.append(`source_address[${key}]`, value);
            });
        } else {
            Object.entries(data.source_address).forEach(([key, value]) => {
                formData.append(`source_address[${key}]`, value);
            });
        }
        if (data.destination_use_account_address) {
            Object.entries({
                zip_code: auth.user?.zip_code || "",
                province_name: auth.user?.province_name || "",
                city_name: auth.user?.city_name || "",
                district_name: auth.user?.district_name || "",
                subdistrict_name: auth.user?.subdistrict_name || "",
                address: auth.user?.address || "",
                address_details: auth.user?.address_details || "",
            }).forEach(([key, value]) => {
                formData.append(`destination_address[${key}]`, value);
            });
        } else {
            Object.entries(data.destination_address).forEach(([key, value]) => {
                formData.append(`destination_address[${key}]`, value);
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
            onSuccess: () => alert("Purchase Request created successfully!"),
            onError: (errors) => {
                setFormErrors(errors);
                alert(
                    "Failed to create Purchase Request. Please check your input."
                );
            },
        });
    };

    return (
        <div className="container mx-auto p-6">
            <Head title="Create Purchase Request" />
            <h1 className="text-2xl font-bold mb-4">Create Purchase Request</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 shadow-md rounded-lg"
                encType="multipart/form-data"
            >
                <div className="mb-4">
                    <label className="block font-semibold">Service</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={data.service_id}
                        onChange={(e) => setData("service_id", e.target.value)}
                        required
                    >
                        <option value="">Select Service</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.service_name}
                            </option>
                        ))}
                    </select>
                    {formErrors.service_id && (
                        <p className="text-red-500">{formErrors.service_id}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">
                        Additional Options
                    </label>
                    {availableAdditionals.length > 0 ? (
                        <div className="space-y-2">
                            {availableAdditionals.map((add) => (
                                <label
                                    key={add.id}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        value={add.id}
                                        checked={data.additionals.some(
                                            (a) => a.id === add.id
                                        )}
                                        onChange={handleAdditionalChange}
                                    />
                                    {add.name} (+{add.additional_price} Rp)
                                    {add.image_path && (
                                        <img
                                            src={`/storage/${add.image_path}`}
                                            alt={add.name}
                                            className="w-12 h-12 object-cover ml-2"
                                        />
                                    )}
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No additional options available for this service.
                        </p>
                    )}
                    {formErrors.additionals && (
                        <p className="text-red-500">{formErrors.additionals}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        required
                    ></textarea>
                    {formErrors.description && (
                        <p className="text-red-500">{formErrors.description}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Upload Photos</label>
                    <input
                        type="file"
                        multiple
                        className="w-full border p-2 rounded"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {photoPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    {formErrors.photos && (
                        <p className="text-red-500">{formErrors.photos}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Weight (kg)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full border p-2 rounded"
                        value={data.weight}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value <= 999.99) {
                                setData("weight", value);
                            } else {
                                alert("Weight must not exceed 999.99 kg");
                            }
                        }}
                        required
                        min="0.1"
                        max="999.99"
                    />
                    {formErrors.weight && (
                        <p className="text-red-500">{formErrors.weight}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">
                        From where will you send the item?
                    </label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="source_address_option"
                                checked={data.source_use_account_address}
                                onChange={() =>
                                    setData("source_use_account_address", true)
                                }
                            />
                            Use my account address
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="source_address_option"
                                checked={!data.source_use_account_address}
                                onChange={() => {
                                    setData(
                                        "source_use_account_address",
                                        false
                                    );
                                    resetAddress("source_address");
                                }}
                            />
                            Enter new address
                        </label>
                    </div>

                    {!data.source_use_account_address && (
                        <div className="mt-4 space-y-2 relative">
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Search location..."
                                value={sourceSearch}
                                onChange={(e) =>
                                    setSourceSearch(e.target.value)
                                }
                            />
                            {sourceLocations.length > 0 && (
                                <ul className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md shadow-md bg-white max-h-60 overflow-auto">
                                    {sourceLocations.map((loc) => (
                                        <li
                                            key={loc.id}
                                            className="p-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() =>
                                                handleLocationSelect(
                                                    "source_address",
                                                    loc
                                                )
                                            }
                                        >
                                            {loc.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Address"
                                value={data.source_address.address}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "source_address",
                                        "address",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Province"
                                value={data.source_address.province_name}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "source_address",
                                        "province_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="City"
                                value={data.source_address.city_name}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "source_address",
                                        "city_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="District"
                                value={data.source_address.district_name}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "source_address",
                                        "district_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Subdistrict"
                                value={data.source_address.subdistrict_name}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "source_address",
                                        "subdistrict_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Postal Code"
                                value={data.source_address.zip_code}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "source_address",
                                        "zip_code",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <textarea
                                className="w-full border p-2 rounded"
                                placeholder="Address Details"
                                value={data.source_address.address_details}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "source_address",
                                        "address_details",
                                        e.target.value
                                    )
                                }
                            />
                            {formErrors["source_address.zip_code"] && (
                                <p className="text-red-500">
                                    {formErrors["source_address.zip_code"]}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">
                        Shipping Options to Admin
                    </label>
                    <select
                        className="w-full border p-2 rounded"
                        value={
                            data.shipping_to_admin_selection
                                ? `${data.shipping_to_admin_selection.code}|${data.shipping_to_admin_selection.service}`
                                : ""
                        }
                        onChange={(e) =>
                            handleShippingOptionChange("to_admin", e)
                        }
                        required
                        disabled={
                            isCalculatingShipping ||
                            shippingOptionsToAdmin.length === 0
                        }
                    >
                        <option value="">Select a shipping option</option>
                        {shippingOptionsToAdmin.map((option) => (
                            <option
                                key={`${option.code}|${option.service}`}
                                value={`${option.code}|${option.service}`}
                            >
                                {option.name} - {option.service} ({option.cost}{" "}
                                Rp, ETD: {option.etd || "N/A"})
                            </option>
                        ))}
                    </select>
                    {formErrors.shipping_to_admin_selection && (
                        <p className="text-red-500">
                            {formErrors.shipping_to_admin_selection}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">
                        Shipping Cost to Admin (Rp)
                    </label>
                    <input
                        type="number"
                        className="w-full border p-2 rounded bg-gray-100"
                        value={data.shipping_cost_to_admin}
                        readOnly
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">
                        Where to send the item after processing?
                    </label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="destination_address_option"
                                checked={data.destination_use_account_address}
                                onChange={() =>
                                    setData(
                                        "destination_use_account_address",
                                        true
                                    )
                                }
                            />
                            Use my account address
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="destination_address_option"
                                checked={!data.destination_use_account_address}
                                onChange={() => {
                                    setData(
                                        "destination_use_account_address",
                                        false
                                    );
                                    resetAddress("destination_address");
                                }}
                            />
                            Enter new address
                        </label>
                    </div>

                    {!data.destination_use_account_address && (
                        <div className="mt-4 space-y-2 relative">
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Search location..."
                                value={destinationSearch}
                                onChange={(e) =>
                                    setDestinationSearch(e.target.value)
                                }
                            />
                            {destinationLocations.length > 0 && (
                                <ul className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md shadow-md bg-white max-h-60 overflow-auto">
                                    {destinationLocations.map((loc) => (
                                        <li
                                            key={loc.id}
                                            className="p-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() =>
                                                handleLocationSelect(
                                                    "destination_address",
                                                    loc
                                                )
                                            }
                                        >
                                            {loc.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Address"
                                value={data.destination_address.address}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "destination_address",
                                        "address",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Province"
                                value={data.destination_address.province_name}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "destination_address",
                                        "province_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="City"
                                value={data.destination_address.city_name}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "destination_address",
                                        "city_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="District"
                                value={data.destination_address.district_name}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "destination_address",
                                        "district_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Subdistrict"
                                value={
                                    data.destination_address.subdistrict_name
                                }
                                onChange={(e) =>
                                    handleAddressChange(
                                        "destination_address",
                                        "subdistrict_name",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Postal Code"
                                value={data.destination_address.zip_code}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "destination_address",
                                        "zip_code",
                                        e.target.value
                                    )
                                }
                                disabled
                            />
                            <textarea
                                className="w-full border p-2 rounded"
                                placeholder="Address Details"
                                value={data.destination_address.address_details}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "destination_address",
                                        "address_details",
                                        e.target.value
                                    )
                                }
                            />
                            {formErrors["destination_address.zip_code"] && (
                                <p className="text-red-500">
                                    {formErrors["destination_address.zip_code"]}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">
                        Shipping Preference to Customer
                    </label>
                    <select
                        className="w-full border p-2 rounded"
                        value={
                            data.shipping_to_customer_preference
                                ? `${data.shipping_to_customer_preference.code}|${data.shipping_to_customer_preference.service}`
                                : ""
                        }
                        onChange={(e) =>
                            handleShippingOptionChange("to_customer", e)
                        }
                        required
                        disabled={
                            isCalculatingShipping ||
                            shippingOptionsToCustomer.length === 0
                        }
                    >
                        <option value="">Select a shipping preference</option>
                        {shippingOptionsToCustomer.map((option) => (
                            <option
                                key={`${option.code}|${option.service}`}
                                value={`${option.code}|${option.service}`}
                            >
                                {option.name} - {option.service} ({option.cost}{" "}
                                Rp, ETD: {option.etd || "N/A"})
                            </option>
                        ))}
                    </select>
                    {formErrors.shipping_to_customer_preference && (
                        <p className="text-red-500">
                            {formErrors.shipping_to_customer_preference}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing || isCalculatingShipping}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {processing ? "Processing..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
