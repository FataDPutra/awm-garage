import React from "react";
import { Camera } from "lucide-react";

const PhotoGallery = ({ photos }) => {
    if (!photos) return null;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Camera size={20} className="mr-2 text-blue-500" /> Foto Barang
            </h3>
            <div className="flex flex-wrap gap-4">
                {Array.isArray(photos) ? (
                    photos.map((photo, index) => (
                        <img
                            key={index}
                            src={`/storage/${photo.replace(/\\/g, "")}`}
                            alt={`Photo ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg border shadow-sm hover:scale-105 transition-transform duration-200"
                        />
                    ))
                ) : (
                    <img
                        src={`/storage/${photos.replace(/\\/g, "")}`}
                        alt="Purchase Request"
                        className="w-full max-w-lg object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                    />
                )}
            </div>
        </div>
    );
};

export default PhotoGallery;
