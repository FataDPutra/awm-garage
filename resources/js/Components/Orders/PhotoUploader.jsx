import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Upload } from "lucide-react";

export default function PhotoUploader({
    photos,
    setPhotos,
    uploadUrl,
    title,
    fieldName,
}) {
    const [isDragging, setIsDragging] = useState(false);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleRemovePhoto = (index) =>
        setPhotos((prev) => prev.filter((_, i) => i !== index));

    const handleUpload = (e) => {
        e.preventDefault();
        if (photos.length === 0)
            return alert("Pilih atau tarik setidaknya satu foto!");
        const formData = new FormData();
        photos.forEach((photo) =>
            formData.append(`${fieldName}[]`, photo.file)
        );
        Inertia.post(uploadUrl, formData, {
            onSuccess: () => {
                alert("Foto berhasil diunggah!");
                setPhotos([]);
            },
            onError: (errors) =>
                alert("Gagal mengunggah foto: " + errors[fieldName]),
        });
    };

    return (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                }`}
            >
                <label className="block">
                    <Upload
                        size={48}
                        className={`mx-auto mb-4 ${
                            isDragging ? "text-blue-500" : "text-gray-400"
                        }`}
                    />
                    <span className="text-gray-600 text-lg font-medium">
                        {isDragging
                            ? "Lepaskan foto di sini"
                            : "Tarik & lepaskan foto atau klik untuk memilih"}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={(e) => e.target.nextSibling.click()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md flex items-center mx-auto"
                        >
                            <Upload size={20} className="mr-2" />
                            Pilih Foto
                        </button>
                    </div>
                </label>
            </div>
            {photos.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={photo.preview}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-lg shadow-md transform transition-all group-hover:scale-105"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-75 hover:opacity-100 transform transition-all hover:scale-110 shadow-sm"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button
                onClick={handleUpload}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md"
            >
                Upload Foto
            </button>
        </div>
    );
}
