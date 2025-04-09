import React, { useState } from "react";
import { Upload, X } from "lucide-react";

export default function ImageUpload({ onImageChange, onImageRemove, preview }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            onImageChange(file);
        } else {
            alert("Please drop an image file.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) onImageChange(file);
    };

    return (
        <div className="space-y-2">
            {!preview ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                        isDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-gray-100"
                    }`}
                >
                    <label className="cursor-pointer">
                        <Upload size={24} className="mx-auto text-gray-500" />
                        <p className="mt-2 text-gray-600">
                            <span className="text-blue-500 hover:underline">
                                Pilih gambar
                            </span>{" "}
                            atau drag & drop di sini
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            ) : (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-105 animate-fade-in"
                    />
                    <button
                        onClick={onImageRemove}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
