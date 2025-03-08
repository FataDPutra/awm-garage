import { Link, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useState, useEffect } from "react";

export default function CustomerShow({ order }) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_receipt_customer: order.shipping_receipt_customer || "",
        shipping_proof_customer: null,
        customer_confirmation: "",
        customer_feedback: "",
        rating: "",
        review: "",
        review_media: [],
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedProof, setUploadedProof] = useState(
        order.shipping_proof_customer
            ? `/storage/${order.shipping_proof_customer}`
            : null
    );
    const [reviewMediaPreviews, setReviewMediaPreviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        if (order.shipping_proof_customer) {
            setUploadedProof(`/storage/${order.shipping_proof_customer}`);
        }
    }, [order]);

    const handleFull = () => {
        Inertia.get(`/payments/${order.offer_price.id}/payment-full`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_id}/confirm-shipment-customer`, {
            preserveScroll: true,
            onSuccess: (page) => {
                alert("Konfirmasi pengiriman berhasil!");
                if (page.props.order.shipping_proof_customer) {
                    setUploadedProof(
                        `/storage/${page.props.order.shipping_proof_customer}`
                    );
                    setData(
                        "shipping_receipt_customer",
                        page.props.order.shipping_receipt_customer
                    );
                } else if (data.shipping_proof_customer) {
                    setUploadedProof(previewImage);
                }
                setPreviewImage(null);
            },
            onError: (errors) => {
                alert(
                    "Gagal mengkonfirmasi pengiriman: " +
                        (errors.message || "Unknown error")
                );
            },
        });
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_id}/confirm`, {
            preserveScroll: true,
            onSuccess: () => alert("Konfirmasi orderan berhasil!"),
        });
    };

    const handleConfirmReceived = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_id}/confirm-received-customer`, {
            preserveScroll: true,
            onSuccess: () => alert("Barang telah dikonfirmasi diterima!"),
            onError: (errors) =>
                alert(
                    "Gagal mengkonfirmasi: " +
                        (errors.message || "Unknown error")
                ),
        });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        console.log(
            "Current review_media state:",
            data.review_media.map((f) => ({
                name: f.name,
                type: f.type,
                size: f.size,
            }))
        );

        const formData = new FormData();
        formData.append("rating", data.rating);
        formData.append("review", data.review || "");
        data.review_media.forEach((media, index) => {
            if (media && media instanceof File && media.size > 0) {
                console.log(`Adding review_media[${index}]:`, media.name);
                formData.append(`review_media[${index}]`, media);
            } else {
                console.log(
                    `Skipping review_media[${index}]: Invalid or empty file`
                );
            }
        });

        console.log("FormData contents:");
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        post(`/orders/${order.order_id}/review`, {
            data: formData,
            preserveScroll: true,
            forceFormData: true, // Pastikan Inertia tahu ini form data
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
            onSuccess: () => {
                alert("Rating dan review berhasil disimpan!");
                setReviewMediaPreviews([]);
                setData({ ...data, rating: "", review: "", review_media: [] });
                setShowReviewForm(false);
                Inertia.reload();
            },
            onError: (errors) => {
                console.log("Errors from server:", errors);
                const errorMsg =
                    Object.values(errors).join(", ") || "Unknown error";
                alert("Gagal menyimpan review: " + errorMsg);
            },
        });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("shipping_proof_customer", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleReviewMediaChange = (e) => {
        const newFiles = Array.from(e.target.files).filter(
            (file) => file && file.size > 0
        );
        if (newFiles.length) {
            console.log(
                "Files selected:",
                newFiles.map((f) => ({
                    name: f.name,
                    type: f.type,
                    size: f.size,
                    lastModified: f.lastModified,
                }))
            );
            const updatedFiles = [...data.review_media, ...newFiles];
            setData("review_media", updatedFiles);
            const updatedPreviews = updatedFiles.map((file) => {
                const preview = URL.createObjectURL(file);
                console.log("Preview URL for", file.name, ":", preview);
                return preview;
            });
            setReviewMediaPreviews(updatedPreviews);
        } else {
            console.log("No valid files selected");
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

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Detail Pesanan</h1>
            <div className="bg-white shadow rounded-lg p-4">
                <p>
                    <strong>Order ID:</strong> {order.order_id}
                </p>
                <p>
                    <strong>Status:</strong> {order.status}
                </p>
                <p>
                    <strong>Total Harga:</strong> Rp{" "}
                    {order.offer_price
                        ? order.offer_price.total_price
                        : "Belum Ditentukan"}
                </p>

                {/* Bagian lain seperti completed_photo_path dan complains tetap sama */}
                {order.completed_photo_path && (
                    <p>
                        <strong>Hasil Pengerjaan </strong>
                    </p>
                )}
                {order.completed_photo_path &&
                    (Array.isArray(order.completed_photo_path) ? (
                        order.completed_photo_path.map((photo, index) => (
                            <div className="mb-4" key={index}>
                                <img
                                    src={`/storage/${photo}`}
                                    alt={`Order ${index}`}
                                    className="w-16 h-16 object-cover rounded border"
                                />
                            </div>
                        ))
                    ) : (
                        <img
                            src={`/storage/${order.completed_photo_path}`}
                            alt="Order"
                            className="w-full max-w-md rounded shadow-md"
                        />
                    ))}

                {order.complains &&
                    order.complains.map(
                        (complain, index) =>
                            complain.revised_photo_path && (
                                <div className="mb-4" key={index}>
                                    {complain.customer_feedback && (
                                        <>
                                            <p>
                                                <strong>
                                                    Perubahan {index + 1}
                                                </strong>
                                            </p>
                                            <p>
                                                <strong>
                                                    Customer Feedback:
                                                </strong>{" "}
                                                {complain.customer_feedback}
                                            </p>
                                        </>
                                    )}
                                    {Array.isArray(
                                        complain.revised_photo_path
                                    ) ? (
                                        complain.revised_photo_path.map(
                                            (photo, photoIndex) => (
                                                <img
                                                    key={photoIndex}
                                                    src={`/storage/${photo}`}
                                                    alt={`Revised ${photoIndex}`}
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            )
                                        )
                                    ) : (
                                        <img
                                            src={`/storage/${complain.revised_photo_path}`}
                                            alt="Revised"
                                            className="w-full max-w-md rounded shadow-md"
                                        />
                                    )}
                                </div>
                            )
                    )}

                {order.completed_photo_path &&
                    order.customer_confirmation === "pending" && (
                        <form
                            onSubmit={handleConfirm}
                            className="mt-4 p-4 bg-gray-100 rounded"
                        >
                            <h2 className="text-lg font-semibold mb-2">
                                Konfirmasi Hasil Pengerjaan
                            </h2>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name="customer_confirmation"
                                        value="approved"
                                        checked={
                                            data.customer_confirmation ===
                                            "approved"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "customer_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <span className="ml-2">Saya Setuju</span>
                                </label>
                            </div>
                            <div className="mt-2">
                                <label>
                                    <input
                                        type="radio"
                                        name="customer_confirmation"
                                        value="rejected"
                                        checked={
                                            data.customer_confirmation ===
                                            "rejected"
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "customer_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <span className="ml-2">
                                        Saya Tidak Setuju
                                    </span>
                                </label>
                            </div>
                            {data.customer_confirmation === "rejected" && (
                                <div className="mt-2">
                                    <label className="block">
                                        <span className="text-gray-700">
                                            Alasan:
                                        </span>
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            value={data.customer_feedback}
                                            onChange={(e) =>
                                                setData(
                                                    "customer_feedback",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                disabled={processing}
                            >
                                {processing
                                    ? "Mengirim..."
                                    : "Kirim Konfirmasi"}
                            </button>
                        </form>
                    )}

                {order.customer_confirmation === "approved" &&
                    order.status === "waiting_for_payment" && (
                        <button
                            onClick={handleFull}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Bayar Full
                        </button>
                    )}

                {order.customer_confirmation === "rejected" &&
                    order.complains.length > 0 && (
                        <div className="mt-4 p-4 bg-red-100 rounded">
                            <h2 className="text-lg font-semibold text-red-600">
                                Keluhan Pelanggan:
                            </h2>
                            <p>
                                {
                                    order.complains[order.complains.length - 1]
                                        .customer_feedback
                                }
                            </p>
                        </div>
                    )}

                {order.status === "waiting_for_customer_shipment" &&
                    !uploadedProof && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                            <h2 className="text-lg font-semibold mb-2">
                                Konfirmasi Pengiriman Barang
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <label className="block mb-2">
                                    <span className="text-gray-700">
                                        Nomor Resi Pengiriman:
                                    </span>
                                    <input
                                        type="text"
                                        value={data.shipping_receipt_customer}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_receipt_customer",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    {errors.shipping_receipt_customer && (
                                        <p className="text-red-500 text-sm">
                                            {errors.shipping_receipt_customer}
                                        </p>
                                    )}
                                </label>
                                <label className="block mb-2">
                                    <span className="text-gray-700">
                                        Unggah Bukti Pengiriman:
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    {errors.shipping_proof_customer && (
                                        <p className="text-red-500 text-sm">
                                            {errors.shipping_proof_customer}
                                        </p>
                                    )}
                                </label>
                                {previewImage && !uploadedProof && (
                                    <div className="mt-2">
                                        <p className="text-gray-700">
                                            Preview Bukti Pengiriman:
                                        </p>
                                        <img
                                            src={previewImage}
                                            alt="Preview Bukti Pengiriman"
                                            className="w-32 h-32 object-cover border rounded-md"
                                        />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Mengirim..."
                                        : "Konfirmasi Pengiriman"}
                                </button>
                            </form>
                        </div>
                    )}

                {(order.shipping ||
                    order.shipping_receipt_customer ||
                    order.shipping_proof_customer) && (
                    <div className="mt-4 p-4 border rounded bg-gray-100">
                        <h3 className="font-bold">Informasi Pengiriman</h3>
                        {order.shipping_receipt_customer && (
                            <p>
                                <strong>Nomor Resi Customer:</strong>{" "}
                                {order.shipping_receipt_customer}
                            </p>
                        )}
                        {uploadedProof && (
                            <div className="mt-2">
                                <p>
                                    <strong>Bukti Pengiriman Customer:</strong>
                                </p>
                                <img
                                    src={uploadedProof}
                                    alt="Bukti Pengiriman"
                                    className="w-48 h-48 object-cover border rounded-md"
                                />
                            </div>
                        )}
                        {order.shipping && (
                            <>
                                <p>
                                    <strong>Kurir:</strong>{" "}
                                    {order.shipping.courier_code} -{" "}
                                    {order.shipping.courier_name} -{" "}
                                    {order.shipping.courier_service}
                                </p>
                                <p>
                                    <strong>Nomor Resi:</strong>{" "}
                                    {order.shipping.tracking_number ||
                                        "Belum Ditambahkan"}
                                </p>
                                <p>
                                    <strong>Tanggal Pengiriman:</strong>{" "}
                                    {order.shipping.shipping_date ||
                                        "Belum Dikirim"}
                                </p>
                                <p>
                                    <strong>Tanggal Diterima:</strong>{" "}
                                    {order.shipping.received_date ||
                                        "Belum Diterima"}
                                </p>
                                <p>
                                    <strong>Status Pengiriman:</strong>{" "}
                                    {order.shipping.status === "in_transit"
                                        ? "Dalam Pengiriman"
                                        : "Diterima"}
                                </p>
                                <p>
                                    <strong>Alamat Penerima:</strong> <br />
                                    {
                                        order.offer_price.purchase_request.user
                                            .phone
                                    }{" "}
                                    <br />
                                    {
                                        order.offer_price.purchase_request
                                            .destination_address.address
                                    }{" "}
                                    <br />
                                    {
                                        order.offer_price.purchase_request
                                            .destination_address
                                            .subdistrict_name
                                    }
                                    ,{" "}
                                    {
                                        order.offer_price.purchase_request
                                            .destination_address.district_name
                                    }{" "}
                                    <br />
                                    {
                                        order.offer_price.purchase_request
                                            .destination_address.city_name
                                    }
                                    ,{" "}
                                    {
                                        order.offer_price.purchase_request
                                            .destination_address.province_name
                                    }{" "}
                                    <br />
                                    {
                                        order.offer_price.purchase_request
                                            .destination_address.zip_code
                                    }{" "}
                                    <br />
                                    {
                                        order.offer_price.purchase_request
                                            .destination_address.address_details
                                    }
                                </p>
                            </>
                        )}
                        {order.shipping?.status === "in_transit" && (
                            <button
                                onClick={handleConfirmReceived}
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Barang Diterima
                            </button>
                        )}
                    </div>
                )}

                {order.status === "completed" && (
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <h2 className="text-lg font-semibold mb-2">
                            Rating dan Review
                        </h2>
                        {order.reviews && order.reviews.length > 0 && (
                            <div className="mb-4">
                                {order.reviews.map((review, index) => (
                                    <div key={index} className="border-b py-2">
                                        <p>
                                            <strong>Rating:</strong>{" "}
                                            {review.rating} / 5
                                        </p>
                                        <p>
                                            <strong>Review:</strong>{" "}
                                            {review.review ||
                                                "Tidak ada ulasan"}
                                        </p>
                                        {review.media_paths &&
                                            review.media_paths.length > 0 && (
                                                <div className="mt-2">
                                                    <p>
                                                        <strong>
                                                            Media Review:
                                                        </strong>
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {review.media_paths.map(
                                                            (
                                                                path,
                                                                mediaIndex
                                                            ) => {
                                                                const isVideo =
                                                                    /\.(mp4|mov|avi)$/i.test(
                                                                        path
                                                                    );
                                                                return isVideo ? (
                                                                    <video
                                                                        key={
                                                                            mediaIndex
                                                                        }
                                                                        src={`/storage/${path}`}
                                                                        controls
                                                                        className="w-32 h-32 object-cover border rounded-md"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        key={
                                                                            mediaIndex
                                                                        }
                                                                        src={`/storage/${path}`}
                                                                        alt={`Review Media ${
                                                                            mediaIndex +
                                                                            1
                                                                        }`}
                                                                        className="w-32 h-32 object-cover border rounded-md"
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {!showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Tambah Review
                            </button>
                        )}
                        {showReviewForm && (
                            <form
                                onSubmit={handleReviewSubmit}
                                className="mt-4"
                            >
                                <label className="block mb-2">
                                    <span className="text-gray-700">
                                        Rating (1-5):
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={data.rating}
                                        onChange={(e) =>
                                            setData("rating", e.target.value)
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                    {errors.rating && (
                                        <p className="text-red-500 text-sm">
                                            {errors.rating}
                                        </p>
                                    )}
                                </label>
                                <label className="block mb-2">
                                    <span className="text-gray-700">
                                        Review:
                                    </span>
                                    <textarea
                                        value={data.review}
                                        onChange={(e) =>
                                            setData("review", e.target.value)
                                        }
                                        className="w-full p-2 border rounded"
                                        rows="4"
                                        placeholder="Tulis ulasan Anda di sini..."
                                    />
                                    {errors.review && (
                                        <p className="text-red-500 text-sm">
                                            {errors.review}
                                        </p>
                                    )}
                                </label>
                                <label className="block mb-2">
                                    <span className="text-gray-700">
                                        Unggah Media Review (gambar/video):
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,video/mp4,video/quicktime,video/avi"
                                        multiple
                                        onChange={handleReviewMediaChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.review_media && (
                                        <p className="text-red-500 text-sm">
                                            {errors.review_media}
                                        </p>
                                    )}
                                </label>
                                {reviewMediaPreviews.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-gray-700">
                                            Preview Media Review:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {reviewMediaPreviews.map(
                                                (preview, index) => {
                                                    const isVideo =
                                                        /\.(mp4|mov|avi)$/i.test(
                                                            data.review_media[
                                                                index
                                                            ].name
                                                        );
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="relative"
                                                        >
                                                            {isVideo ? (
                                                                <video
                                                                    src={
                                                                        preview
                                                                    }
                                                                    controls
                                                                    className="w-32 h-32 object-cover border rounded-md"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        preview
                                                                    }
                                                                    alt={`Preview ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className="w-32 h-32 object-cover border rounded-md"
                                                                />
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveReviewMedia(
                                                                        index
                                                                    )
                                                                }
                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-2 flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Mengirim..."
                                            : "Kirim Review"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                <Link
                    href="/orders"
                    className="mt-4 block text-blue-600 hover:underline"
                >
                    Kembali
                </Link>
            </div>
        </div>
    );
}
