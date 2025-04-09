// resources/js/Components/Admin/PhotoGallery.jsx
import React, { useState } from "react";
import { Camera, ZoomIn, X } from "lucide-react";

const PhotoGallery = ({ photos }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (!photos) return null;

    // Fungsi untuk membuka foto dalam ukuran penuh
    const openPhoto = (photo, e) => {
        e.stopPropagation(); // Mencegah event menyebar ke elemen luar
        setSelectedPhoto(`/storage/${photo.replace(/\\/g, "")}`);
    };

    // Fungsi untuk menutup foto
    const closePhoto = (e) => {
        e.stopPropagation(); // Mencegah event menyebar
        setSelectedPhoto(null);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <Camera size={24} className="mr-2 text-blue-500" /> Foto Barang
            </h3>
            <div className="flex flex-wrap gap-6">
                {Array.isArray(photos) ? (
                    photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer"
                            onClick={(e) => openPhoto(photo, e)}
                        >
                            <img
                                src={`/storage/${photo.replace(/\\/g, "")}`}
                                alt={`Foto ${index + 1}`}
                                className="w-48 h-48 object-cover rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
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
                            src={`/storage/${photos.replace(/\\/g, "")}`}
                            alt="Foto Barang"
                            className="w-full max-w-2xl object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-lg">
                            <ZoomIn size={24} className="text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal untuk foto ukuran penuh */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-auto"
                    onClick={closePhoto} // Tutup hanya jika klik di luar gambar
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] mx-auto"
                        onClick={(e) => e.stopPropagation()} // Cegah klik di dalam modal menutupnya
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
        </div>
    );
};

export default PhotoGallery;
