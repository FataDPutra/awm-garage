import React from "react";
import { Image, X } from "lucide-react";

const PhotoUpload = ({
    data,
    setData,
    photoPreviews,
    setPhotoPreviews,
    formErrors,
    handleFileChange,
    handleRemovePhoto,
}) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <Image size={20} className="mr-2 text-blue-500" /> Unggah Foto
        </label>
        <p className="text-gray-600 text-sm mb-2">
            Kirim foto barang Anda yang ingin diproses
        </p>
        <input
            type="file"
            multiple
            className="w-full border p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
            capture="camera"
            onChange={handleFileChange}
        />
        <div className="flex flex-wrap gap-4 mt-2">
            {photoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                    <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-28 h-28 object-cover rounded-lg shadow"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
        {formErrors.photos && (
            <p className="text-red-500 text-sm">{formErrors.photos}</p>
        )}
    </div>
);

export default PhotoUpload;
