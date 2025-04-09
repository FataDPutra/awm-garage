import React, { useState } from "react";
import { Star, ZoomIn, X } from "lucide-react";

export default function ReviewSection({ reviews }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (!reviews || reviews.length === 0) return null;

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
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <Star size={20} className="mr-2 text-yellow-500" />
                Rating dan Review Pelanggan
            </h3>
            <div className="space-y-6">
                {reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 mr-2">
                                Rating:
                            </span>
                            <span className="text-yellow-500 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={
                                            i < review.rating
                                                ? "fill-current"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                                <span className="ml-2 text-gray-600">
                                    ({review.rating}/5)
                                </span>
                            </span>
                        </div>
                        {review.review && (
                            <p className="text-sm text-gray-600">
                                <strong>Ulasan:</strong> {review.review}
                            </p>
                        )}
                        {review.media_paths &&
                            review.media_paths.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Media Review:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {review.media_paths.map(
                                            (path, mediaIndex) => {
                                                const isVideo =
                                                    /\.(mp4|mov|avi)$/i.test(
                                                        path
                                                    );
                                                return isVideo ? (
                                                    <video
                                                        key={mediaIndex}
                                                        src={`/storage/${path}`}
                                                        controls
                                                        className="w-full h-48 object-cover rounded-md border shadow-sm"
                                                    />
                                                ) : (
                                                    <div
                                                        key={mediaIndex}
                                                        className="relative group cursor-pointer"
                                                        onClick={(e) =>
                                                            openPhoto(path, e)
                                                        }
                                                    >
                                                        <img
                                                            src={`/storage/${path}`}
                                                            alt={`Review Media ${
                                                                mediaIndex + 1
                                                            }`}
                                                            className="w-full h-48 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                                            <ZoomIn
                                                                size={24}
                                                                className="text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                ))}
            </div>

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
