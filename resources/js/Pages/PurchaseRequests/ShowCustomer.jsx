import React from "react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function ShowCustomer() {
    const { purchaseRequest } = usePage().props;

    const handleAcceptOffer = () => {
        Inertia.post(`/purchase-requests/${purchaseRequest.id}/accept-offer`);
    };

    const handleRejectOffer = () => {
        Inertia.post(`/purchase-requests/${purchaseRequest.id}/reject-offer`);
    };
    const handleDP = () => {
        Inertia.get(`/payments/${purchaseRequest.offer_price.id}/payment-dp`);
    };
    const handleFull = () => {
        Inertia.get(`/payments/${purchaseRequest.offer_price.id}/payment-full`);
    };

    return (
        <div className="p-6 bg-white shadow rounded">
            <h2 className="text-lg font-bold">Detail Purchase Request</h2>
            Menampilkan Foto
            {/* {purchaseRequest.photo_path && (
                <div className="mb-4">
                    <img
                        src={`/storage/${purchaseRequest.photo_path}`}
                        alt="Purchase Request"
                        className="w-full max-w-md rounded shadow-md"
                    />
                </div>
            )} */}
            {purchaseRequest.photo_path &&
                (Array.isArray(purchaseRequest.photo_path) ? (
                    purchaseRequest.photo_path.map((photo, index) => (
                        <div className="mb-4" key={index}>
                            <img
                                src={`/storage/${photo.replace(/\\/g, "")}`} // Remove any backslashes
                                alt={`Purchase Request ${index}`}
                                className="w-16 h-16 object-cover rounded border"
                            />
                        </div>
                    ))
                ) : (
                    <div className="mb-4">
                        <img
                            src={`/storage/${purchaseRequest.photo_path.replace(
                                /\\/g,
                                ""
                            )}`} // Remove any backslashes
                            alt="Purchase Request"
                            className="w-full max-w-md rounded shadow-md"
                        />
                    </div>
                ))}
            <p>
                <strong>Service:</strong>{" "}
                {purchaseRequest.service?.service_name}
            </p>
            <p>
                <strong>Description:</strong> {purchaseRequest.description}
            </p>
            <p>
                <strong>Weight:</strong> {purchaseRequest.weight} kg
            </p>
            <p>
                <strong>Shipping Cost:</strong> Rp{" "}
                {purchaseRequest.shipping_cost}
            </p>
            {/* Menampilkan Offer Price jika status offer_sent atau processing */}
            {(purchaseRequest.status === "offer_sent" ||
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
                            {purchaseRequest.offer_price.estimation_days} days
                        </p>
                        <p>
                            <strong>Total Price:</strong> Rp{" "}
                            {purchaseRequest.offer_price.total_price}
                        </p>
                    </div>
                )}
            {/* Menampilkan Tombol Setuju/Tidak Setuju jika statusnya offer_price */}
            {purchaseRequest.status === "offer_sent" &&
                purchaseRequest.offer_price && (
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleAcceptOffer}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Setuju
                        </button>
                        <button
                            onClick={handleRejectOffer}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Tidak Setuju
                        </button>
                    </div>
                )}
            {/* Menampilkan Offer Price Status jika statusnya processing */}
            {purchaseRequest.status === "processing" &&
                purchaseRequest.offer_price && (
                    <div className="mt-4 p-4 border rounded bg-gray-100">
                        <p>
                            <strong>Status Pembayaran DP:</strong>{" "}
                            {purchaseRequest.offer_price.status}
                        </p>
                        <p>
                            <strong>Status Pesanan:</strong> Siapkan Barang
                            Untuk Dikirim{" "}
                        </p>
                    </div>
                )}
            {/* Menampilkan Tombol Pembayaran jika statusnya waiting_for_dp */}
            {purchaseRequest.status === "waiting_for_dp" && (
                <div className="mt-4">
                    <button
                        onClick={handleDP}
                        className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
                    >
                        Bayar DP
                    </button>
                    <button
                        onClick={handleFull}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Bayar Full
                    </button>
                </div>
            )}
        </div>
    );
}
