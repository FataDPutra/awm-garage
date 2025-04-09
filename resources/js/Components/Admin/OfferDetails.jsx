import React from "react";

const OfferDetails = ({ purchaseRequest, setIsEditingOffer }) => {
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
                Detail Penawaran
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                    <strong>Harga Jasa:</strong> Rp{" "}
                    {purchaseRequest.offer_price.service_price}
                </p>
                <p>
                    <strong>Jumlah DP:</strong> Rp{" "}
                    {purchaseRequest.offer_price.dp_amount}
                </p>
                <p>
                    <strong>Estimasi Hari:</strong>{" "}
                    {purchaseRequest.offer_price.estimation_days} hari
                    {purchaseRequest.offer_price.shipping_to_customer_details
                        ?.etd && (
                        <span className="text-gray-500">
                            {" (Total: " +
                                getTotalEstimatedDays(
                                    purchaseRequest.offer_price.estimation_days,
                                    purchaseRequest.offer_price
                                        .shipping_to_customer_details.etd
                                ) +
                                ")"}
                        </span>
                    )}
                </p>
                <p>
                    <strong>Biaya Pengiriman ke Pelanggan:</strong> Rp{" "}
                    {purchaseRequest.offer_price.shipping_cost_to_customer}
                </p>
                <p>
                    <strong>Detail Pengiriman:</strong>{" "}
                    {
                        purchaseRequest.offer_price.shipping_to_customer_details
                            ?.name
                    }{" "}
                    -{" "}
                    {
                        purchaseRequest.offer_price.shipping_to_customer_details
                            ?.service
                    }
                </p>
                <p>
                    <strong>Total Harga:</strong> Rp{" "}
                    {purchaseRequest.offer_price.total_price}
                </p>
                <p className="col-span-1 sm:col-span-2">
                    <strong>Status:</strong>{" "}
                    {purchaseRequest.offer_price.status}
                </p>
                {purchaseRequest.offer_price.status === "pending" && (
                    <div className="col-span-1 sm:col-span-2">
                        <button
                            onClick={() => setIsEditingOffer(true)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all duration-200 w-full sm:w-auto"
                        >
                            Edit Penawaran
                        </button>
                    </div>
                )}
                {purchaseRequest.additional_details &&
                    purchaseRequest.additional_details.length > 0 && (
                        <div className="col-span-1 sm:col-span-2 mt-2">
                            <strong>Opsi Tambahan:</strong>
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
                        </div>
                    )}
            </div>
        </div>
    );
};

export default OfferDetails;
