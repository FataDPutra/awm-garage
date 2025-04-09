import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

const OfferForm = ({ purchaseRequest, isEditingOffer, setIsEditingOffer }) => {
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
            setShippingError("Invalid weight value");
            return;
        }

        const destinationZipCode =
            purchaseRequest.destination_address?.zip_code;
        if (!destinationZipCode) {
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
                setShippingError("No shipping options available from server");
            }
        } catch (error) {
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
        if (purchaseRequest.weight) {
            calculateShippingCostToCustomer(purchaseRequest.weight);
        } else {
            setShippingError("Weight is missing in purchase request");
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
                        alert("Offer Price updated successfully!");
                        setIsEditingOffer(false);
                    },
                    onError: () =>
                        alert(
                            "Failed to update Offer Price. Please check your input."
                        ),
                }
            );
        } else {
            post(route("admin.purchaserequests.offer", purchaseRequest.id), {
                onSuccess: () => alert("Offer Price sent successfully!"),
                onError: () =>
                    alert(
                        "Failed to send Offer Price. Please check your input."
                    ),
            });
        }
    };

    const getTotalEstimatedDays = (estimationDays, etd) => {
        if (!estimationDays || !etd) return "N/A";
        const minEtd = parseInt(etd.split("-")[0]);
        const maxEtd = parseInt(etd.split("-")[1] || etd.split("-")[0]);
        const days = parseInt(estimationDays);
        return `${days + minEtd} - ${days + maxEtd} hari`;
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {isEditingOffer ? "Edit Penawaran" : "Buat Penawaran"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold text-gray-700">
                            Harga Jasa (Rp)
                        </label>
                        <input
                            type="number"
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.service_price}
                            onChange={(e) =>
                                setData("service_price", e.target.value)
                            }
                            required
                            min="0"
                        />
                        {errors.service_price && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.service_price}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700">
                            Jumlah DP (Rp) - 50%
                        </label>
                        <input
                            type="number"
                            className="w-full border p-3 rounded-lg bg-gray-100"
                            value={data.dp_amount}
                            readOnly
                        />
                        {errors.dp_amount && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.dp_amount}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700">
                            Estimasi Hari
                        </label>
                        <input
                            type="number"
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={data.estimation_days}
                            onChange={(e) =>
                                setData("estimation_days", e.target.value)
                            }
                            required
                            min="1"
                        />
                        {data.estimation_days &&
                            data.shipping_to_customer_selection?.etd && (
                                <p className="text-gray-500 text-sm mt-1">
                                    Total Estimasi + Pengiriman:{" "}
                                    {getTotalEstimatedDays(
                                        data.estimation_days,
                                        data.shipping_to_customer_selection.etd
                                    )}
                                </p>
                            )}
                        {errors.estimation_days && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.estimation_days}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700">
                            Opsi Pengiriman ke Pelanggan
                        </label>
                        <select
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                            <option value="">Pilih opsi pengiriman</option>
                            {shippingOptionsToCustomer.map((option) => (
                                <option
                                    key={`${option.code}|${option.service}`}
                                    value={`${option.code}|${option.service}`}
                                >
                                    {option.name} - {option.service} (
                                    {option.cost} Rp, ETD: {option.etd || "N/A"}
                                    )
                                </option>
                            ))}
                        </select>
                        {isCalculatingShipping && (
                            <p className="text-gray-500 text-sm mt-1">
                                Menghitung opsi pengiriman...
                            </p>
                        )}
                        {shippingError && (
                            <p className="text-red-500 text-sm mt-1">
                                {shippingError}
                            </p>
                        )}
                        {shippingOptionsToCustomer.length === 0 &&
                            !isCalculatingShipping &&
                            !shippingError && (
                                <p className="text-red-500 text-sm mt-1">
                                    Tidak ada opsi pengiriman tersedia.
                                </p>
                            )}
                        {errors.shipping_to_customer_selection && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.shipping_to_customer_selection}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700">
                            Biaya Pengiriman ke Pelanggan (Rp)
                        </label>
                        <input
                            type="number"
                            className="w-full border p-3 rounded-lg bg-gray-100"
                            value={data.shipping_cost_to_customer}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-gray-700">
                            Total Harga (Rp)
                        </label>
                        <input
                            type="number"
                            className="w-full border p-3 rounded-lg bg-gray-100"
                            value={data.total_price}
                            readOnly
                        />
                        {errors.total_price && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.total_price}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        type="submit"
                        disabled={processing || isCalculatingShipping}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 w-full sm:w-auto"
                    >
                        {processing
                            ? "Processing..."
                            : isEditingOffer
                            ? "Update Penawaran"
                            : "Kirim Penawaran"}
                    </button>
                    {isEditingOffer && (
                        <button
                            type="button"
                            onClick={() => setIsEditingOffer(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 w-full sm:w-auto"
                        >
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default OfferForm;
