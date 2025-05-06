import React from "react";
import { Link } from "@inertiajs/react";
import { Eye, Trash2, Paintbrush } from "lucide-react";

export default function ServiceList({ services, onDelete }) {
    return (
        <div className="container mx-auto">
            {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {service.service_name}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {service.description ||
                                        "Tidak ada deskripsi tersedia."}
                                </p>
                                <p className="text-gray-800 font-semibold mb-4">
                                    Harga: Rp{" "}
                                    {service.base_price.toLocaleString("id-ID")}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-end gap-3">
                                    <Link
                                        href={route(
                                            "admin.services.show",
                                            service.id
                                        )}
                                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 justify-center"
                                    >
                                        <Eye size={16} /> Detail
                                    </Link>
                                    <button
                                        onClick={() => onDelete(service.id)}
                                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 justify-center"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
                    Belum ada layanan.
                </div>
            )}
        </div>
    );
}
