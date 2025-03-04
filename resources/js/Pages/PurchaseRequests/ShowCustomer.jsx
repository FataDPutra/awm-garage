import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function ShowCustomer() {
    const { purchaseRequest } = usePage().props;

    const handleAcceptOffer = () => {
        Inertia.post(
            route("purchase_requests.acceptOffer", purchaseRequest.id)
        );
    };

    const handleRejectOffer = () => {
        Inertia.post(
            route("purchase_requests.rejectOffer", purchaseRequest.id)
        );
    };

    const handleDP = () => {
        Inertia.get(
            route("payments.payment-dp", purchaseRequest.offer_price.id)
        );
    };

    const handleFull = () => {
        Inertia.get(
            route("payments.payment-full", purchaseRequest.offer_price.id)
        );
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
            <div className="bg-white p-6 shadow rounded">
                <h2 className="text-lg font-bold mb-4">
                    Detail Purchase Request #{purchaseRequest.id}
                </h2>

                {purchaseRequest.photo_path && (
                    <div className="mb-4">
                        {Array.isArray(purchaseRequest.photo_path) ? (
                            purchaseRequest.photo_path.map((photo, index) => (
                                <img
                                    key={index}
                                    src={`/storage/${photo.replace(/\\/g, "")}`}
                                    alt={`Photo ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded border mr-2 inline-block"
                                />
                            ))
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
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                        <strong>Service:</strong>{" "}
                        {purchaseRequest.service?.service_name}
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
                        <strong>Source Address:</strong> <br />
                        {purchaseRequest.source_address.province_name} <br />
                        {purchaseRequest.source_address.district_name} <br />
                        {purchaseRequest.source_address.subdistrict_name} <br />
                        {purchaseRequest.source_address.address} <br />
                        {purchaseRequest.source_address.address_details}
                    </p>
                    <p>
                        <strong>Destination Address:</strong> <br />
                        {purchaseRequest.destination_address.province_name}{" "}
                        <br />
                        {purchaseRequest.destination_address.district_name}{" "}
                        <br />
                        {
                            purchaseRequest.destination_address.subdistrict_name
                        }{" "}
                        <br />
                        {purchaseRequest.destination_address.address} <br />
                        {purchaseRequest.destination_address.address_details}
                    </p>
                    <p>
                        <strong>Shipping Preference to Customer:</strong>{" "}
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

                {(purchaseRequest.status === "offer_sent" ||
                    purchaseRequest.status === "waiting_for_dp" ||
                    purchaseRequest.status === "processing") &&
                    purchaseRequest.offer_price && (
                        <div className="mt-4 p-4 border rounded bg-gray-100">
                            <h3 className="font-bold">Offer Price</h3>
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
                                {purchaseRequest.offer_price.estimation_days}{" "}
                                days
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

                            {/* Tambahkan Additional Details di Offer Price */}
                            {purchaseRequest.additional_details &&
                                purchaseRequest.additional_details.length >
                                    0 && (
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
                                                        {
                                                            add.additional_price
                                                        }{" "}
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
                                    </div>
                                )}
                        </div>
                    )}
                {purchaseRequest.status === "pending" && (
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() =>
                                Inertia.get(
                                    route(
                                        "purchase_requests.edit",
                                        purchaseRequest.id
                                    )
                                )
                            }
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                        >
                            Edit Purchase Request
                        </button>
                    </div>
                )}

                {purchaseRequest.status === "offer_sent" &&
                    purchaseRequest.offer_price && (
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={handleAcceptOffer}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Accept Offer
                            </button>
                            <button
                                onClick={handleRejectOffer}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Reject Offer
                            </button>
                        </div>
                    )}

                {purchaseRequest.status === "waiting_for_dp" && (
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleDP}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Pay DP
                        </button>
                        <button
                            onClick={handleFull}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Pay Full
                        </button>
                    </div>
                )}

                {purchaseRequest.status === "processing" &&
                    purchaseRequest.offer_price && (
                        <div className="mt-4 p-4 border rounded bg-gray-100">
                            <p>
                                <strong>Payment Status:</strong>{" "}
                                {purchaseRequest.offer_price.status}
                            </p>
                            <p>
                                <strong>Order Status:</strong> Prepare your item
                                for shipping
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
}
