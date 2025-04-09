import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function PhotoUploadSection({ order, isRevised = false }) {
    const [photos, setPhotos] = useState([]);
    const [previewPhotos, setPreviewPhotos] = useState([]);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
        setPreviewPhotos((prev) => [
            ...prev,
            ...newPhotos.map((p) => p.preview),
        ]);
    };

    const handleRemovePhoto = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
        setPreviewPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (photos.length === 0)
            return alert("Silakan pilih setidaknya satu foto!");

        const formData = new FormData();
        photos.forEach((photo) =>
            formData.append(
                isRevised ? "revised_photo[]" : "completed_photo[]",
                photo.file
            )
        );

        Inertia.post(
            `/admin/orders/${order.order_id}/${
                isRevised ? "upload-revision-photo" : "upload-completed"
            }`,
            formData,
            {
                onSuccess: () => {
                    alert(
                        `Foto ${
                            isRevised ? "revisi" : "hasil pengerjaan"
                        } berhasil diunggah!`
                    );
                    setPhotos([]);
                    setPreviewPhotos([]);
                },
                onError: (errors) =>
                    alert(
                        `Gagal mengunggah foto: ${
                            errors.completedPhoto || errors.revisedPhoto
                        }`
                    ),
            }
        );
    };

    return (
        <form
            onSubmit={handleUpload}
            className="bg-white shadow-md rounded-lg p-4 mb-6"
        >
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {isRevised ? "Upload Foto Revisi" : "Upload Hasil Pengerjaan"}
            </h3>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 mb-2"
            />
            {previewPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {previewPhotos.map((preview, index) => (
                        <div key={index} className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded border"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                onClick={() => handleRemovePhoto(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            >
                Upload Foto
            </button>
        </form>
    );
}
