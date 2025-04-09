import React from "react";

export default function ServiceDetails({ service }) {
    // Assuming additionals are loaded with the service in the controller
    const additionals = service.additionals || [];

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6 border-b pb-2 border-indigo-200">
                Detail Layanan
            </h3>
            <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Nama Layanan:
                    </strong>{" "}
                    <span className="text-indigo-600 font-medium">
                        {service.service_name}
                    </span>
                </p>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Deskripsi:
                    </strong>{" "}
                    {service.description || "Tidak ada deskripsi tersedia"}
                </p>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Harga Dasar:
                    </strong>{" "}
                    <span className="text-green-600 font-medium">
                        Rp {service.base_price.toLocaleString()}
                    </span>
                </p>
                {additionals.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                            Tambahan Layanan
                        </h4>
                        <div className="space-y-4">
                            {additionals.map((additional, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4"
                                >
                                    {additional.image_path && (
                                        <img
                                            src={`/storage/${additional.image_path}`}
                                            alt={additional.name}
                                            className="w-16 h-16 object-cover rounded-lg shadow-md border-2 border-indigo-100"
                                        />
                                    )}
                                    <div>
                                        <p className="text-gray-700 text-lg">
                                            <strong className="font-semibold text-gray-800">
                                                Nama:
                                            </strong>{" "}
                                            {additional.name}
                                        </p>
                                        <p className="text-gray-700 text-lg">
                                            <strong className="font-semibold text-gray-800">
                                                Tipe:
                                            </strong>{" "}
                                            {additional.additional_type?.name ||
                                                "N/A"}
                                        </p>
                                        <p className="text-gray-700 text-lg">
                                            <strong className="font-semibold text-gray-800">
                                                Harga Tambahan:
                                            </strong>{" "}
                                            <span className="text-green-600 font-medium">
                                                Rp{" "}
                                                {additional.additional_price.toLocaleString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
