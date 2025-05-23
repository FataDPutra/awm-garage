// resources/js/Components/Customer/Orders/ReviewsSection.jsx
import React, { useState } from "react";
import { Star, Upload, ZoomIn, X } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";

export default function ReviewsSection({
    order,
    data,
    setData,
    post,
    processing,
    showReviewForm,
    setShowReviewForm,
    reviewMediaPreviews,
    setReviewMediaPreviews,
    hoverRating,
    setHoverRating,
}) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    if (order.status !== "completed") return null;

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("rating", data.rating);
        formData.append("review", data.review || "");
        data.review_media.forEach((media, index) => {
            if (media && media instanceof File && media.size > 0) {
                formData.append(`review_media[${index}]`, media);
            }
        });

        post(`/orders/${order.order_id}/review`, {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
            onSuccess: () => {
                alert("Rating dan review berhasil disimpan!");
                setReviewMediaPreviews([]);
                setData({ ...data, rating: 0, review: "", review_media: [] });
                setShowReviewForm(false);
                Inertia.reload();
            },
            onError: (errors) => {
                const errorMsg =
                    Object.values(errors).join(", ") || "Unknown error";
                alert("Gagal menyimpan review: " + errorMsg);
            },
        });
    };

    const handleReviewMediaChange = (e) => {
        const newFiles = Array.from(e.target.files).filter(
            (file) => file && file.size > 0
        );
        if (newFiles.length) {
            const updatedFiles = [...data.review_media, ...newFiles];
            setData("review_media", updatedFiles);
            const updatedPreviews = updatedFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setReviewMediaPreviews(updatedPreviews);
        }
    };

    const handleRemoveReviewMedia = (index) => {
        const updatedFiles = data.review_media.filter((_, i) => i !== index);
        const updatedPreviews = reviewMediaPreviews.filter(
            (_, i) => i !== index
        );
        setData("review_media", updatedFiles);
        setReviewMediaPreviews(updatedPreviews);
    };

    const openPhoto = (photo, e) => {
        e.stopPropagation();
        setSelectedPhoto(photo); // Untuk preview dan media yang sudah ada, gunakan path langsung
    };

    const closePhoto = (e) => {
        e.stopPropagation();
        setSelectedPhoto(null);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={24}
                className={`cursor-pointer transition-colors ${
                    i < rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                }`}
                onClick={() => setData("rating", i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
            />
        ));
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <Star size={20} className="mr-2 text-yellow-500" />
                Rating dan Review
            </h3>
            {order.reviews && order.reviews.length > 0 ? (
                <div className="space-y-6">
                    {order.reviews.map((review, index) => (
                        <div
                            key={index}
                            className="border-b pb-4 last:border-b-0"
                        >
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
                                                    return (
                                                        <div
                                                            key={mediaIndex}
                                                            className="relative group cursor-pointer"
                                                            onClick={(e) =>
                                                                openPhoto(
                                                                    `/storage/${path}`,
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            {isVideo ? (
                                                                <video
                                                                    src={`/storage/${path}`}
                                                                    controls
                                                                    className="w-full h-48 object-cover rounded-md border shadow-sm"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={`/storage/${path}`}
                                                                    alt={`Review Media ${
                                                                        mediaIndex +
                                                                        1
                                                                    }`}
                                                                    className="w-full h-48 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                                                />
                                                            )}
                                                            {!isVideo && (
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                                                    <ZoomIn
                                                                        size={
                                                                            24
                                                                        }
                                                                        className="text-white"
                                                                    />
                                                                </div>
                                                            )}
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
            ) : (
                <p className="text-sm text-gray-500">
                    Belum ada review untuk pesanan ini.
                </p>
            )}

            <button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md"
            >
                Tambah Review
            </button>

            {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating:
                        </label>
                        <div className="flex items-center">
                            {renderStars(hoverRating || data.rating)}
                            <span className="ml-2 text-gray-600">
                                ({data.rating}/5)
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ulasan:
                        </label>
                        <textarea
                            value={data.review}
                            onChange={(e) => setData("review", e.target.value)}
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="4"
                            placeholder="Bagikan pengalaman Anda..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unggah Media (Opsional):
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <input
                                type="file"
                                accept="image/*,video/mp4,video/quicktime,video/avi"
                                multiple
                                onChange={handleReviewMediaChange}
                                className="hidden"
                                id="review-media-upload"
                            />
                            <label
                                htmlFor="review-media-upload"
                                className="cursor-pointer"
                            >
                                <Upload
                                    size={32}
                                    className="mx-auto text-gray-500 mb-2"
                                />
                                <p className="text-sm text-gray-600">
                                    Drag & drop media atau{" "}
                                    <span className="text-blue-600 underline">
                                        klik untuk memilih
                                    </span>
                                </p>
                            </label>
                        </div>
                        {reviewMediaPreviews.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Preview Media:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {reviewMediaPreviews.map(
                                        (preview, index) => {
                                            const isVideo =
                                                /\.(mp4|mov|avi)$/i.test(
                                                    data.review_media[index]
                                                        .name
                                                );
                                            return (
                                                <div
                                                    key={index}
                                                    className="relative group cursor-pointer"
                                                    onClick={(e) =>
                                                        openPhoto(preview, e)
                                                    }
                                                >
                                                    {isVideo ? (
                                                        <video
                                                            src={preview}
                                                            controls
                                                            className="w-full h-48 object-cover rounded-md border shadow-sm"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-48 object-cover rounded-md border shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg"
                                                        />
                                                    )}
                                                    {!isVideo && (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-md">
                                                            <ZoomIn
                                                                size={24}
                                                                className="text-white"
                                                            />
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveReviewMedia(
                                                                index
                                                            );
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md"
                            disabled={processing}
                        >
                            {processing ? "Mengirim..." : "Kirim Review"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-700 text-white py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-200 shadow-md"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            )}

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
