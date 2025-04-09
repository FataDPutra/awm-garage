import React, { useState } from "react";
import { ZoomIn, X } from "lucide-react";

export default function PhotoSection({
    title,
    photos,
    complains,
    isRevision = false,
}) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(`/storage/${photo.replace(/\\/g, "")}`);
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {title}
            </h3>
            {isRevision ? (
                complains.map(
                    (complain, index) =>
                        complain.revised_photo_path && (
                            <div key={index} className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600">
                                    <strong>Perubahan {index + 1}:</strong>{" "}
                                    {complain.customer_feedback ||
                                        "Tidak ada feedback"}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {Array.isArray(
                                        complain.revised_photo_path
                                    ) ? (
                                        complain.revised_photo_path.map(
                                            (photo, photoIndex) => (
                                                <div
                                                    key={photoIndex}
                                                    className="relative group cursor-pointer"
                                                    onClick={(e) =>
                                                        openPhoto(photo, e)
                                                    }
                                                >
                                                    <img
                                                        src={`/storage/${photo}`}
                                                        alt={`Revised ${photoIndex}`}
                                                        className="w-full h-48 md:h-64 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                                        <ZoomIn
                                                            size={24}
                                                            className="text-white"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div
                                            className="relative group cursor-pointer"
                                            onClick={(e) =>
                                                openPhoto(
                                                    complain.revised_photo_path,
                                                    e
                                                )
                                            }
                                        >
                                            <img
                                                src={`/storage/${complain.revised_photo_path}`}
                                                alt="Revised"
                                                className="w-full h-48 md:h-64 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                                <ZoomIn
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                )
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.isArray(photos) ? (
                        photos.map((photo, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={(e) => openPhoto(photo, e)}
                            >
                                <img
                                    src={`/storage/${photo}`}
                                    alt={`Completed ${index}`}
                                    className="w-full h-48 md:h-64 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                    <ZoomIn size={24} className="text-white" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="relative group cursor-pointer"
                            onClick={(e) => openPhoto(photos, e)}
                        >
                            <img
                                src={`/storage/${photos}`}
                                alt="Completed Work"
                                className="w-full h-48 md:h-64 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                <ZoomIn size={24} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal untuk foto ukuran penuh */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-auto"
                    onClick={closePhoto}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedPhoto}
                            alt="Foto Ukuran Penuh"
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
        </section>
    );
}
