import React from "react";
import PhotoUploader from "./PhotoUploader";

export default function ComplaintSection({
    order,
    photos,
    setPhotos,
    uploadUrl,
}) {
    const latestComplain = order.complains[order.complains.length - 1];

    return (
        <div className="space-y-8">
            {order.complains.map(
                (complain, index) =>
                    complain.revised_photo_path && (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Perubahan #{index + 1}
                            </h3>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg shadow-sm">
                                <strong className="text-gray-800">
                                    Feedback Customer:
                                </strong>{" "}
                                {complain.customer_feedback ||
                                    "Belum ada feedback"}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong className="text-gray-800">
                                    Tanggal:
                                </strong>{" "}
                                {new Date(
                                    complain.created_at
                                ).toLocaleDateString("id-ID")}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                {(Array.isArray(complain.revised_photo_path)
                                    ? complain.revised_photo_path
                                    : [complain.revised_photo_path]
                                ).map((photo, photoIndex) => (
                                    <img
                                        key={photoIndex}
                                        src={`/storage/${photo}`}
                                        alt={`Revised ${photoIndex}`}
                                        className="w-full h-40 object-cover rounded-lg shadow-md border-2 border-gray-100 transform transition-all hover:scale-105"
                                    />
                                ))}
                            </div>
                        </div>
                    )
            )}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-red-900 mb-3">
                    Keluhan Terbaru
                </h3>
                <p className="text-red-800 bg-white p-4 rounded-lg shadow-sm text-lg">
                    {latestComplain.customer_feedback ||
                        "Menunggu revisi dari admin."}
                </p>
                <p className="text-gray-600 mt-2 italic">
                    Tanggal:{" "}
                    {new Date(latestComplain.created_at).toLocaleDateString(
                        "id-ID"
                    )}
                </p>
            </div>
            <PhotoUploader
                photos={photos}
                setPhotos={setPhotos}
                uploadUrl={uploadUrl}
                title="Upload Foto Revisi"
                fieldName="revised_photo"
            />
        </div>
    );
}
