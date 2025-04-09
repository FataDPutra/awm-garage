import React from "react";

export default function ServiceForm({ data, setData, errors }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block font-semibold text-gray-700">
                    Nama Layanan
                </label>
                <input
                    type="text"
                    value={data.service_name}
                    onChange={(e) => setData("service_name", e.target.value)}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                />
                {errors.service_name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.service_name}
                    </p>
                )}
            </div>
            <div>
                <label className="block font-semibold text-gray-700">
                    Deskripsi
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                    </p>
                )}
            </div>
            <div>
                <label className="block font-semibold text-gray-700">
                    Harga Dasar (Rp)
                </label>
                <input
                    type="number"
                    value={data.base_price}
                    onChange={(e) => setData("base_price", e.target.value)}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                    min="0"
                />
                {errors.base_price && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.base_price}
                    </p>
                )}
            </div>
        </div>
    );
}
