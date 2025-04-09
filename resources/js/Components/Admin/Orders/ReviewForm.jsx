import React from "react";
import { Star } from "lucide-react";

export default function ReviewForm({
    onSubmit,
    data,
    setData,
    errors,
    reviewMediaPreviews,
    handleReviewMediaChange,
    handleRemoveReviewMedia,
}) {
    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <Star size={20} className="mr-2 text-yellow-500" />
                Berikan Rating dan Review
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Rating (1-5):
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={data.rating}
                        onChange={(e) => setData("rating", e.target.value)}
                        className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.rating}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Review:
                    </label>
                    <textarea
                        value={data.review}
                        onChange={(e) => setData("review", e.target.value)}
                        className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Tulis ulasan Anda di sini..."
                    />
                    {errors.review && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.review}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Unggah Media Review (gambar/video):
                    </label>
                    <input
                        type="file"
                        accept="image/*,video/mp4,video/quicktime,video/avi"
                        multiple
                        onChange={handleReviewMediaChange}
                        className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.review_media && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.review_media}
                        </p>
                    )}
                </div>
                {reviewMediaPreviews.length > 0 && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">
                            Preview Media Review:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {reviewMediaPreviews.map((preview, index) => {
                                const isVideo = /\.(mp4|mov|avi)$/i.test(
                                    data.review_media[index].name
                                );
                                return (
                                    <div key={index} className="relative">
                                        {isVideo ? (
                                            <video
                                                src={preview}
                                                controls
                                                className="w-full h-48 object-cover rounded-md border shadow-sm"
                                            />
                                        ) : (
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-md border shadow-sm"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveReviewMedia(index)
                                            }
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md"
                >
                    Kirim Review
                </button>
            </form>
        </section>
    );
}
