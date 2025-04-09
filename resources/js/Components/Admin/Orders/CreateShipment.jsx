import React from "react";

export default function CreateShipment({
    trackingNumber,
    setTrackingNumber,
    onCreate,
}) {
    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Buat Pengiriman
            </h3>
            <form onSubmit={onCreate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nomor Resi (Opsional):
                    </label>
                    <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nomor resi"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-md"
                >
                    Buat Pengiriman
                </button>
            </form>
        </section>
    );
}
