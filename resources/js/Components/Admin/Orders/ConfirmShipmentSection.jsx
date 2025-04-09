import React from "react";

export default function ConfirmShipmentSection({
    onSubmit,
    data,
    setData,
    errors,
    previewImage,
    handleFileChange,
}) {
    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Konfirmasi Pengiriman Barang
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Nomor Resi Pengiriman:
                    </label>
                    <input
                        type="text"
                        value={data.shipping_receipt_customer}
                        onChange={(e) =>
                            setData("shipping_receipt_customer", e.target.value)
                        }
                        className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.shipping_receipt_customer && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.shipping_receipt_customer}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Unggah Bukti Pengiriman:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.shipping_proof_customer && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.shipping_proof_customer}
                        </p>
                    )}
                </div>
                {previewImage && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">
                            Preview Bukti Pengiriman:
                        </p>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-48 h-48 object-cover rounded-md border shadow-sm"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md"
                >
                    Konfirmasi Pengiriman
                </button>
            </form>
        </section>
    );
}
