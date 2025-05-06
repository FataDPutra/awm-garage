import React, { useState } from "react";
import { Plus, ZoomIn, X } from "lucide-react";

const AdditionalOptions = ({
    availableAdditionals,
    data,
    setData,
    formErrors,
    handleAdditionalChange,
}) => {
    const [selectedAdditionalPhoto, setSelectedAdditionalPhoto] =
        useState(null);

    const openPhoto = (photo, e) => {
        e.stopPropagation(); // Mencegah event checkbox terpicu
        setSelectedAdditionalPhoto(`/storage/${photo}`);
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedAdditionalPhoto(null);
    };

    return (
        <div className="space-y-2">
            <label className="block font-semibold text-gray-700 flex items-center">
                <Plus size={20} className="mr-2 text-blue-500" /> Opsi Tambahan
            </label>
            {availableAdditionals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableAdditionals.map((add) => (
                        <label
                            key={add.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                        >
                            <input
                                type="checkbox"
                                value={add.id}
                                checked={data.additionals.some(
                                    (a) => a.id === add.id
                                )}
                                onChange={handleAdditionalChange}
                                className="h-5 w-5 text-blue-500"
                            />
                            <div className="flex-1">
                                {add.name}{" "}
                                <span className="text-green-600">
                                    +{add.additional_price} Rp
                                </span>
                            </div>
                            {add.image_path && (
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={(e) =>
                                        openPhoto(add.image_path, e)
                                    }
                                >
                                    <img
                                        src={`/storage/${add.image_path}`}
                                        alt={add.name}
                                        className="w-12 h-12 object-cover rounded border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded">
                                        <ZoomIn
                                            size={16}
                                            className="text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </label>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">
                    Tidak ada opsi tambahan untuk layanan ini.
                </p>
            )}
            {formErrors.additionals && (
                <p className="text-red-500 text-sm">{formErrors.additionals}</p>
            )}

            {/* Modal untuk foto ukuran penuh */}
            {selectedAdditionalPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-auto"
                    onClick={closePhoto}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedAdditionalPhoto}
                            alt="Foto Opsi Tambahan"
                            className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-lg"
                        />
                        <button
                            onClick={closePhoto}
                            className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 transition-all duration-200 z-10 shadow-md"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdditionalOptions;
