import React from "react";
import { Inertia } from "@inertiajs/inertia";

export default function ShipmentForm({
    orderId,
    trackingNumber,
    setTrackingNumber,
}) {
    const handleCreateShipment = (e) => {
        e.preventDefault();
        Inertia.post(
            `/admin/orders/${orderId}/create-shipment`,
            { tracking_number: trackingNumber },
            {
                onSuccess: () => {
                    alert("Pengiriman berhasil dibuat!");
                    setTrackingNumber("");
                },
                onError: (errors) =>
                    alert(
                        "Gagal membuat pengiriman: " +
                            (errors.tracking_number ||
                                errors.message ||
                                "Unknown error")
                    ),
            }
        );
    };

    return (
        <form
            onSubmit={handleCreateShipment}
            className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl"
        >
            <h3 className="text-2xl font-bold text-yellow-900 mb-4">
                Buat Pengiriman
            </h3>
            <label className="block mb-6">
                <span className="text-gray-700 text-lg font-semibold">
                    Nomor Resi (Opsional):
                </span>
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 bg-white shadow-sm text-lg"
                    placeholder="Masukkan nomor resi pengiriman"
                />
                <p className="text-gray-600 mt-1 text-sm italic">
                    Kosongkan jika pengiriman belum memiliki nomor resi.
                </p>
            </label>
            <button
                type="submit"
                className="bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-md"
            >
                Create Shipment
            </button>
        </form>
    );
}
