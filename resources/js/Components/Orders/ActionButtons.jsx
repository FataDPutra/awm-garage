import React from "react";
import { Inertia } from "@inertiajs/inertia";

export default function ActionButtons({ order }) {
    const handleConfirmReceived = () => {
        Inertia.post(
            `/admin/orders/${order.order_id}/confirm-received`,
            {},
            {
                onSuccess: () => alert("Barang diterima dikonfirmasi."),
                onError: (errors) =>
                    alert("Gagal mengonfirmasi: " + errors.message),
            }
        );
    };

    const handleMarkAsReadyToShip = () => {
        Inertia.post(
            `/admin/orders/${order.order_id}/ready-to-ship`,
            {},
            {
                onSuccess: () => alert("Pesanan siap dikirim."),
                onError: (errors) => alert("Gagal: " + errors.message),
            }
        );
    };

    const handleCreateShipment = (e) => {
        e.preventDefault();
        const trackingNumber = e.target.tracking_number.value;
        Inertia.post(
            `/admin/orders/${order.order_id}/create-shipment`,
            { tracking_number: trackingNumber },
            {
                onSuccess: () => {
                    alert("Pengiriman berhasil dibuat!");
                    e.target.reset();
                },
                onError: (errors) =>
                    alert(
                        "Gagal: " + (errors.tracking_number || errors.message)
                    ),
            }
        );
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {order.status === "waiting_for_admin_confirmation" && (
                <button
                    onClick={handleConfirmReceived}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                >
                    Konfirmasi Barang Diterima
                </button>
            )}
            {order.status === "processing" && (
                <button
                    onClick={handleMarkAsReadyToShip}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-all"
                >
                    Tandai Siap Dikirim
                </button>
            )}
            {order.status === "waiting_for_shipment" && (
                <form onSubmit={handleCreateShipment} className="flex gap-2">
                    <input
                        type="text"
                        name="tracking_number"
                        placeholder="Nomor Resi (Opsional)"
                        className="p-2 border rounded w-full sm:w-auto"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                    >
                        Buat Pengiriman
                    </button>
                </form>
            )}
        </div>
    );
}
