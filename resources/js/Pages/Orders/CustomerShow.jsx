import { Link, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";

export default function CustomerShow({ order }) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_receipt_customer: "",
        shipping_proof_customer: null,
        customer_confirmation: "",
        customer_feedback: "",
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleFull = () => {
        Inertia.get(`/payments/${order.offer_price.id}/payment-full`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_id}/confirm-shipment-customer`, {
            preserveScroll: true,
            onSuccess: () => alert("Konfirmasi pengiriman berhasil!"),
        });
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        post(
            `/orders/${order.order_id}/confirm`,
            {
                customer_confirmation: data.customer_confirmation,
                customer_feedback: data.customer_feedback,
            },
            {
                preserveScroll: true,
                onSuccess: () => alert("Konfirmasi orderan berhasil!"),
            }
        );
    };

    // [CHANGED] Fungsi untuk Konfirmasi Barang Diterima
    const handleConfirmReceived = () => {
        Inertia.post(`/orders/${order.order_id}/confirm-received-customer`, {
            preserveScroll: true,
            onSuccess: () => alert("Barang telah dikonfirmasi diterima!"),
            onError: (errors) =>
                alert(
                    "Gagal mengkonfirmasi: " +
                        (errors.message || "Unknown error")
                ),
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("shipping_proof_customer", file);
            setPreviewImage(URL.createObjectURL(file));
        }
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

                {order.status === "waiting_for_customer_shipment" && (
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
                            {previewImage && (
                                <div className="mt-2">
                                    <p className="text-gray-700">Preview:</p>
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

                {order.shipping && (
                    <div className="mt-4 p-4 border rounded bg-gray-100">
                        <h3 className="font-bold">Informasi Pengiriman</h3>
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
                            {order.shipping.shipping_date || "Belum Dikirim"}
                        </p>
                        <p>
                            <strong>Tanggal Diterima:</strong>{" "}
                            {order.shipping.received_date || "Belum Diterima"}
                        </p>
                        <p>
                            <strong>Status Pengiriman:</strong>{" "}
                            {order.shipping.status === "in_transit"
                                ? "Dalam Pengiriman"
                                : "Diterima"}
                        </p>
                        <p>
                            <strong>Alamat Penerima:</strong> <br />
                            {order.offer_price.purchase_request.user.phone}{" "}
                            <br />
                            {
                                order.offer_price.purchase_request
                                    .destination_address.address
                            }{" "}
                            <br />
                            {
                                order.offer_price.purchase_request
                                    .destination_address.subdistrict_name
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
                        {/* [CHANGED] Tombol Barang Diterima */}
                        {order.shipping.status === "in_transit" && (
                            <button
                                onClick={handleConfirmReceived}
                                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Barang Diterima
                            </button>
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
