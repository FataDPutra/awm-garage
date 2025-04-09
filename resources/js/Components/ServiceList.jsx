import React from "react";
import { Link } from "@inertiajs/react";
import { Edit2, Trash2 } from "lucide-react";

export default function ServiceList({ services, onDelete }) {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            {/* Tabel untuk Desktop */}
            <div className="hidden sm:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-4 font-semibold border-b">
                                Nama Layanan
                            </th>
                            <th className="p-4 font-semibold border-b">
                                Deskripsi
                            </th>
                            <th className="p-4 font-semibold border-b">
                                Harga
                            </th>
                            <th className="p-4 font-semibold border-b text-center">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length > 0 ? (
                            services.map((service) => (
                                <tr
                                    key={service.id}
                                    className="border-b hover:bg-gray-50 transition-all duration-200"
                                >
                                    <td className="p-4 font-medium text-gray-800">
                                        {service.service_name}
                                    </td>
                                    <td className="p-4 text-gray-600 truncate max-w-xs">
                                        {service.description}
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800">
                                        Rp{" "}
                                        {service.base_price.toLocaleString(
                                            "id-ID"
                                        )}
                                    </td>
                                    <td className="p-4 flex justify-center gap-3">
                                        <Link
                                            href={route(
                                                "services.edit",
                                                service.id
                                            )}
                                            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                                        >
                                            <Edit2 size={16} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => onDelete(service.id)}
                                            className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="p-6 text-center text-gray-500"
                                >
                                    Belum ada layanan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Card untuk Mobile */}
            <div className="block sm:hidden space-y-4 p-4">
                {services.length > 0 ? (
                    services.map((service) => (
                        <div
                            key={service.id}
                            className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {service.service_name}
                                </h3>
                            </div>
                            <p className="text-gray-600 truncate">
                                {service.description}
                            </p>
                            <p className="text-gray-700 mt-1 font-semibold">
                                Rp {service.base_price.toLocaleString("id-ID")}
                            </p>
                            <div className="mt-3 flex justify-end gap-2">
                                <Link
                                    href={route("services.edit", service.id)}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    <Edit2 size={16} /> Edit
                                </Link>
                                <button
                                    onClick={() => onDelete(service.id)}
                                    className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        Belum ada layanan.
                    </div>
                )}
            </div>
        </div>
    );
}
