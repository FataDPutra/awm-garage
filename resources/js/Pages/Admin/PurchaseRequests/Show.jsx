import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import axios from "axios";

export default function Show({ purchaseRequest }) {
    const { data, setData, post, errors, processing } = useForm({
        service_price: "",
        dp_amount: "",
        estimation_days: "",
        shipping_cost_to_customer:
            purchaseRequest.shipping_to_customer_preference?.cost || 0,
        shipping_to_customer_selection:
            purchaseRequest.shipping_to_customer_preference || null,
        total_price: "",
        pr_id: purchaseRequest.id,
    });

    const [shippingOptionsToCustomer, setShippingOptionsToCustomer] = useState(
        []
    );
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [shippingError, setShippingError] = useState(null);

    const calculateShippingCostToCustomer = async (weight) => {
        if (!weight || weight <= 0 || isNaN(weight)) {
            console.log("Weight is invalid:", weight);
            setShippingError("Invalid weight value");
            return;
        }

        const destinationZipCode =
            purchaseRequest.destination_address?.zip_code;
        if (!destinationZipCode) {
            console.log(
                "Destination ZIP code is missing:",
                purchaseRequest.destination_address
            );
            setShippingError(
                "Destination ZIP code is missing in purchase request"
            );
            return;
        }

        setIsCalculatingShipping(true);
        setShippingError(null);
        try {
            const adminResponse = await axios.get("/api/admin-zip-code");
            const originZipCode = adminResponse.data.zip_code;

            console.log(
                "Fetching shipping options for weight:",
                weight,
                "Destination:",
                destinationZipCode,
                "Origin:",
                originZipCode
            );
            const response = await axios.post(
                "/calculate-shipping-to-customer",
                {
                    weight: weight * 1000,
                    destination: destinationZipCode,
                    origin: originZipCode,
                }
            );
            console.log("Shipping options response:", response.data);
            const costs = response.data.costs || [];
            setShippingOptionsToCustomer(costs);
            if (costs.length > 0) {
                const preferred =
                    costs.find(
                        (opt) =>
                            opt.code ===
                                purchaseRequest.shipping_to_customer_preference
                                    ?.code &&
                            opt.service ===
                                purchaseRequest.shipping_to_customer_preference
                                    ?.service
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
                console.log("No shipping options returned");
                setShippingError("No shipping options available from server");
            }
        } catch (error) {
            console.error(
                "Error calculating shipping cost to customer:",
                error.response?.data || error.message
            );
            setShippingError(
                error.response?.data?.error ||
                    "Failed to fetch shipping options"
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
        console.log("Purchase Request Props:", purchaseRequest);
        if (purchaseRequest.weight) {
            calculateShippingCostToCustomer(purchaseRequest.weight);
        } else {
            console.log("Weight missing in purchaseRequest");
            setShippingError("Weight is missing in purchase request");
        }
    }, [purchaseRequest.weight]);

    useEffect(() => {
        if (data.service_price) {
            const servicePrice = parseFloat(data.service_price);
            const dpAmount = (servicePrice * 0.5).toFixed(2);
            const totalPrice =
                servicePrice + parseFloat(data.shipping_cost_to_customer);
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
        post(route("admin.purchaserequests.offer", purchaseRequest.id), {
            onSuccess: () => alert("Offer Price sent successfully!"),
            onError: () =>
                alert("Failed to send Offer Price. Please check your input."),
        });
    };

    const getTotalEstimatedDays = (estimationDays, etd) => {
        if (!estimationDays || !etd) return "N/A";
        const minEtd = parseInt(etd.split("-")[0]);
        const maxEtd = parseInt(etd.split("-")[1] || etd.split("-")[0]);
        const days = parseInt(estimationDays);
        return `${days + minEtd} - ${days + maxEtd} days`;
    };

    return (
        <div className="container mx-auto p-6">
            <Head title="Purchase Request Details" />
            <h1 className="text-2xl font-bold mb-4">
                Purchase Request #{purchaseRequest.id}
            </h1>

            <div className="bg-white p-6 shadow-md rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                        <strong>Customer:</strong>{" "}
                        {purchaseRequest.user.full_name}
                    </p>
                    <p>
                        <strong>Service:</strong>{" "}
                        {purchaseRequest.service.service_name}
                    </p>
                    <p>
                        <strong>Description:</strong>{" "}
                        {purchaseRequest.description}
                    </p>
                    <p>
                        <strong>Weight:</strong> {purchaseRequest.weight} kg
                    </p>

                    {/* Tambahkan Additional Details */}
                    <div className="col-span-2">
                        <strong>Additional Options:</strong>
                        {purchaseRequest.additional_details &&
                        purchaseRequest.additional_details.length > 0 ? (
                            <ul className="list-disc pl-5 mt-1">
                                {purchaseRequest.additional_details.map(
                                    (add, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            {add.name} (+{add.additional_price}{" "}
                                            Rp)
                                            {add.image_path && (
                                                <img
                                                    src={`/storage/${add.image_path}`}
                                                    alt={add.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                        </li>
                                    )
                                )}
                            </ul>
                        ) : (
                            <span className="ml-2 text-gray-500">
                                No additional options selected
                            </span>
                        )}
                    </div>

                    <p>
                        <strong>Shipping Cost to Admin:</strong> Rp{" "}
                        {purchaseRequest.shipping_cost_to_admin}
                    </p>
                    <p>
                        <strong>Shipping to Admin Details:</strong>{" "}
                        {purchaseRequest.shipping_to_admin_details?.name} -{" "}
                        {purchaseRequest.shipping_to_admin_details?.service}{" "}
                        (ETD:{" "}
                        {purchaseRequest.shipping_to_admin_details?.etd ||
                            "N/A"}
                        )
                    </p>
                    <p>
                        <strong>Source Address:</strong>{" "}
                        {purchaseRequest.source_address.address_details}
                    </p>
                    <p>
                        <strong>Destination Address:</strong>{" "}
                        {purchaseRequest.destination_address.address_details}
                    </p>
                    <p>
                        <strong>Customer Shipping Preference:</strong>{" "}
                        {purchaseRequest.shipping_to_customer_preference?.name}{" "}
                        -{" "}
                        {
                            purchaseRequest.shipping_to_customer_preference
                                ?.service
                        }{" "}
                        ({purchaseRequest.shipping_to_customer_preference?.cost}{" "}
                        Rp, ETD:{" "}
                        {purchaseRequest.shipping_to_customer_preference?.etd ||
                            "N/A"}
                        )
                    </p>
                </div>

                {purchaseRequest.photo_path && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Photos:</h3>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(purchaseRequest.photo_path) ? (
                                purchaseRequest.photo_path.map(
                                    (photo, index) => (
                                        <img
                                            key={index}
                                            src={`/storage/${photo.replace(
                                                /\\/g,
                                                ""
                                            )}`}
                                            alt={`Photo ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded border"
                                        />
                                    )
                                )
                            ) : (
                                <img
                                    src={`/storage/${purchaseRequest.photo_path.replace(
                                        /\\/g,
                                        ""
                                    )}`}
                                    alt="Purchase Request"
                                    className="w-full max-w-md rounded shadow-md"
                                />
                            )}
                        </div>
                    </div>
                )}

                {!purchaseRequest.offer_price ? (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <h2 className="text-lg font-semibold">
                            Create Offer Price
                        </h2>

                        <div>
                            <label className="block font-semibold">
                                Service Price (Rp)
                            </label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                value={data.service_price}
                                onChange={(e) =>
                                    setData("service_price", e.target.value)
                                }
                                required
                                min="0"
                            />
                            {errors.service_price && (
                                <p className="text-red-500">
                                    {errors.service_price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold">
                                DP Amount (Rp) - 50% of Service Price
                            </label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded bg-gray-100"
                                value={data.dp_amount}
                                readOnly
                            />
                            {errors.dp_amount && (
                                <p className="text-red-500">
                                    {errors.dp_amount}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold">
                                Estimation Days
                            </label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                value={data.estimation_days}
                                onChange={(e) =>
                                    setData("estimation_days", e.target.value)
                                }
                                required
                                min="1"
                            />
                            {data.estimation_days &&
                                data.shipping_to_customer_selection?.etd && (
                                    <p className="text-gray-500">
                                        Total Estimated Delivery:{" "}
                                        {getTotalEstimatedDays(
                                            data.estimation_days,
                                            data.shipping_to_customer_selection
                                                .etd
                                        )}
                                    </p>
                                )}
                            {errors.estimation_days && (
                                <p className="text-red-500">
                                    {errors.estimation_days}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold">
                                Shipping Options to Customer
                            </label>
                            <select
                                className="w-full border p-2 rounded"
                                value={
                                    data.shipping_to_customer_selection
                                        ? `${data.shipping_to_customer_selection.code}|${data.shipping_to_customer_selection.service}`
                                        : ""
                                }
                                onChange={handleShippingOptionChange}
                                required
                                disabled={
                                    isCalculatingShipping ||
                                    shippingOptionsToCustomer.length === 0
                                }
                            >
                                <option value="">
                                    Select a shipping option
                                </option>
                                {shippingOptionsToCustomer.map((option) => (
                                    <option
                                        key={`${option.code}|${option.service}`}
                                        value={`${option.code}|${option.service}`}
                                    >
                                        {option.name} - {option.service} (
                                        {option.cost} Rp, ETD:{" "}
                                        {option.etd || "N/A"})
                                    </option>
                                ))}
                            </select>
                            {isCalculatingShipping && (
                                <p className="text-gray-500">
                                    Calculating shipping options...
                                </p>
                            )}
                            {shippingError && (
                                <p className="text-red-500">{shippingError}</p>
                            )}
                            {shippingOptionsToCustomer.length === 0 &&
                                !isCalculatingShipping &&
                                !shippingError && (
                                    <p className="text-red-500">
                                        No shipping options available.
                                    </p>
                                )}
                            {errors.shipping_to_customer_selection && (
                                <p className="text-red-500">
                                    {errors.shipping_to_customer_selection}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold">
                                Shipping Cost to Customer (Rp)
                            </label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded bg-gray-100"
                                value={data.shipping_cost_to_customer}
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">
                                Total Price (Rp)
                            </label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded bg-gray-100"
                                value={data.total_price}
                                readOnly
                            />
                            {errors.total_price && (
                                <p className="text-red-500">
                                    {errors.total_price}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || isCalculatingShipping}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {processing ? "Processing..." : "Submit Offer"}
                        </button>
                    </form>
                ) : (
                    <div className="mt-6 p-4 border rounded bg-gray-100">
                        <h2 className="font-bold">Offer Price Sent</h2>
                        <p>
                            <strong>Service Price:</strong> Rp{" "}
                            {purchaseRequest.offer_price.service_price}
                        </p>
                        <p>
                            <strong>DP Amount:</strong> Rp{" "}
                            {purchaseRequest.offer_price.dp_amount}
                        </p>
                        <p>
                            <strong>Estimation Days:</strong>{" "}
                            {purchaseRequest.offer_price.estimation_days} days
                            {purchaseRequest.offer_price
                                .shipping_to_customer_details?.etd && (
                                <span>
                                    {" (Total: " +
                                        getTotalEstimatedDays(
                                            purchaseRequest.offer_price
                                                .estimation_days,
                                            purchaseRequest.offer_price
                                                .shipping_to_customer_details
                                                .etd
                                        ) +
                                        ")"}
                                </span>
                            )}
                        </p>
                        <p>
                            <strong>Shipping Cost to Customer:</strong> Rp{" "}
                            {
                                purchaseRequest.offer_price
                                    .shipping_cost_to_customer
                            }
                        </p>
                        <p>
                            <strong>Shipping Details:</strong>{" "}
                            {
                                purchaseRequest.offer_price
                                    .shipping_to_customer_details?.name
                            }{" "}
                            -{" "}
                            {
                                purchaseRequest.offer_price
                                    .shipping_to_customer_details?.service
                            }
                        </p>
                        <p>
                            <strong>Total Price:</strong> Rp{" "}
                            {purchaseRequest.offer_price.total_price}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            {purchaseRequest.offer_price.status}
                        </p>

                        {/* Tampilkan Additional Details di Offer Price */}
                        {purchaseRequest.additional_details &&
                            purchaseRequest.additional_details.length > 0 && (
                                <div className="mt-2">
                                    <strong>Additional Options:</strong>
                                    <ul className="list-disc pl-5 mt-1">
                                        {purchaseRequest.additional_details.map(
                                            (add, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    {add.name} (+
                                                    {add.additional_price} Rp)
                                                    {add.image_path && (
                                                        <img
                                                            src={`/storage/${add.image_path}`}
                                                            alt={add.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    )}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}
