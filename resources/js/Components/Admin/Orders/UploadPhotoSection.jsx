import React, { useState } from "react";
import { Upload, ZoomIn, X } from "lucide-react";

export default function UploadPhotoSection({
    title,
    photos,
    onPhotoChange,
    onRemovePhoto,
    onUpload,
    buttonText,
    complaint,
}) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        onPhotoChange(files);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        onPhotoChange(files);
    };

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo.preview); // Gunakan preview dari photo object
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            {complaint && (
                <div className="p-4 bg-red-50 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-red-700">
                        Keluhan Pelanggan
                    </h3>
                    <p className="text-sm text-red-600">
                        {complaint || "Tidak ada feedback"}
                    </p>
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {title}
            </h3>
            <form onSubmit={onUpload} className="space-y-4">
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id={`${title.toLowerCase().replace(" ", "-")}-upload`}
                    />
                    <label
                        htmlFor={`${title
                            .toLowerCase()
                            .replace(" ", "-")}-upload`}
                        className="cursor-pointer"
                    >
                        <Upload
                            size={32}
                            className="mx-auto text-gray-500 mb-2"
                        />
                        <p className="text-sm text-gray-600">
                            Drag & drop foto atau{" "}
                            <span className="text-blue-600 underline">
                                klik untuk memilih
                            </span>
                        </p>
                    </label>
                </div>
                {photos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={(e) => openPhoto(photo, e)}
                            >
                                <img
                                    src={photo.preview}
                                    alt="Preview"
                                    className="w-full h-48 md:h-64 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                    <ZoomIn size={24} className="text-white" />
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemovePhoto(index);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md flex items-center justify-center"
                >
                    <Upload size={18} className="mr-2" />
                    {buttonText}
                </button>
            </form>

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
