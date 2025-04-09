import React from "react";
import { Trash2 } from "lucide-react";

export default function AdditionalList({ data, additionalTypes, onRemove }) {
    return (
        data.additionals.length > 0 && (
            <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                    Daftar Additional
                </h3>
                <div className="space-y-4">
                    {data.additionals.map((add, index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border p-4 rounded-lg bg-gray-50"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <p className="text-gray-700">
                                    <strong>Tipe:</strong>{" "}
                                    {additionalTypes.find(
                                        (t) => t.id === add.additional_type_id
                                    )?.name || "Tidak Diketahui"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Nama:</strong> {add.name}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Harga:</strong> Rp{" "}
                                    {add.additional_price.toLocaleString(
                                        "id-ID"
                                    ) || 0}
                                </p>
                                {add.preview && (
                                    <img
                                        src={add.preview}
                                        alt={`Preview ${add.name}`}
                                        className="w-16 h-16 object-cover rounded-lg border shadow-sm transition-transform duration-300 hover:scale-105"
                                    />
                                )}
                            </div>
                            {onRemove && (
                                <button
                                    onClick={() => onRemove(index)}
                                    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <Trash2 size={18} /> Hapus
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    );
}
