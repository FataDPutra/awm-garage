import { Link, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function CustomerShow({ order }) {
    const { data, setData, post, processing, errors } = useForm({
        shipping_receipt_customer: "",
        shipping_proof_customer: null,
        customer_confirmation: "",
        customer_feedback: "",
    });

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

                {/* {order.completed_photo_path && (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">
                            Hasil Pengerjaan:
                        </h2>
                        <img
                            src={`/storage/${order.completed_photo_path}`}
                            alt="Completed Work"
                            className="w-64 h-64 object-cover mt-2 border rounded-lg"
                        />
                    </div>
                )} */}
                {/* {order.completed_photo_path.length > 0 && (
                    <p>
                        <strong>Hasil Pengerjaan </strong>
                    </p>
                )} */}

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

                {/* {order.complains.customer_feedback > 0 && (
                    <>
                        <p>
                            <strong>Pengerjaan Terbaru</strong>
                        </p>
                        <p>
                            <strong>Customer Feedback : </strong>{" "}
                            {order.complains.customer_feedback}
                        </p>
                    </>
                    
                )} */}

                {order.complains &&
                    order.complains.map(
                        (complain, index) =>
                            complain.revised_photo_path && (
                                <div className="mb-4" key={index}>
                                    {/* Tampilkan Customer Feedback jika ada */}
                                    {complain.customer_feedback && (
                                        <>
                                            <p>
                                                <strong>Perubahan</strong>{" "}
                                                {index + 1}
                                            </p>
                                            <p>
                                                <strong>
                                                    Customer Feedback:
                                                </strong>{" "}
                                                {complain.customer_feedback}
                                            </p>
                                        </>
                                    )}

                                    {/* Tampilkan Revised Photo jika ada */}
                                    {Array.isArray(
                                        complain.revised_photo_path
                                    ) ? (
                                        // Jika revised_photo_path adalah array, tampilkan semua foto
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
                                        // Jika revised_photo_path bukan array, tampilkan satu foto
                                        <img
                                            src={`/storage/${complain.revised_photo_path}`}
                                            alt="Revised"
                                            className="w-full max-w-md rounded shadow-md"
                                        />
                                    )}
                                </div>
                            )
                    )}

                {/* {order.revised_photo_path &&
                    (Array.isArray(order.revised_photo_path) ? (
                        order.revised_photo_path.map((revised, index) => (
                            <>
                                <p>
                                    <strong>Pengerjaan Terbaru</strong>
                                </p>
                                <p>
                                    <strong>Customer Feedback : </strong>{" "}
                                    {order.customer_feedback}
                                </p>
                                <div className="mb-4" key={index}>
                                    <img
                                        src={`/storage/${revised.replace(
                                            /\\/g,
                                            ""
                                        )}`} // Remove any backslashes
                                        alt={`Order ${index}`}
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                </div>
                            </>
                        ))
                    ) : (
                        <div className="mb-4">
                            <img
                                src={`/storage/${order.revised_photo_path.replace(
                                    /\\/g,
                                    ""
                                )}`} // Remove any backslashes
                                alt="Order"
                                className="w-full max-w-md rounded shadow-md"
                            />
                        </div>
                    ))} */}

                {/* Jika completed_photo_path sudah ada dan pelanggan belum konfirmasi */}
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

                {/* Jika pelanggan setuju, munculkan tombol bayar */}
                {order.customer_confirmation === "approved" &&
                    order.status === "waiting_for_payment" && (
                        <button
                            onClick={handleFull}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Bayar Full
                        </button>
                    )}

                {/* Jika pelanggan tidak setuju, tampilkan alasan */}
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

                {/* Form untuk konfirmasi pengiriman jika statusnya 'waiting_for_customer_shipment' */}
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
                                    onChange={(e) =>
                                        setData(
                                            "shipping_proof_customer",
                                            e.target.files[0]
                                        )
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                {errors.shipping_proof_customer && (
                                    <p className="text-red-500 text-sm">
                                        {errors.shipping_proof_customer}
                                    </p>
                                )}
                            </label>

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
