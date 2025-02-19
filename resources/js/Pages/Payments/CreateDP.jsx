import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";

export default function CreateDP({ offerPrice, purchaseRequest }) {
    const { data, setData, post } = useForm({
        offerprice_id: offerPrice.id, // Sesuai dengan field di Payment
        amount: offerPrice.dp_amount,
        payment_method: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/payments/${data.offerprice_id}/payment-dp`, {
            amount: data.amount,
            payment_method: data.payment_method,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pembayaran DP" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Pembayaran DP</h1>

                {/* 🔹 Tampilkan Data Purchase Request */}
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h2 className="text-lg font-semibold">
                        Detail Purchase Request
                    </h2>
                    <p>
                        <strong>Deskripsi:</strong>{" "}
                        {purchaseRequest.description}
                    </p>
                    <p>
                        <strong>Berat:</strong> {purchaseRequest.weight} kg
                    </p>
                    <p>
                        <strong>Ongkos Kirim:</strong> Rp{" "}
                        {purchaseRequest.shipping_cost}
                    </p>
                    <p>
                        <strong>Status:</strong> {purchaseRequest.status}
                    </p>
                    {/* {purchaseRequest.photo_path && (
                        <img
                            src={`/storage/${purchaseRequest.photo_path}`}
                            alt="Foto Barang"
                            className="mt-2 w-32 h-32 object-cover rounded"
                        />
                    )} */}

                    {purchaseRequest.photo_path &&
                        (Array.isArray(purchaseRequest.photo_path) ? (
                            purchaseRequest.photo_path.map((photo, index) => (
                                <div className="mb-4" key={index}>
                                    <img
                                        src={`/storage/${photo.replace(
                                            /\\/g,
                                            ""
                                        )}`} // Remove any backslashes
                                        alt={`Purchase Request ${index}`}
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="mb-4">
                                <img
                                    src={`/storage/${purchaseRequest.photo_path.replace(
                                        /\\/g,
                                        ""
                                    )}`} // Remove any backslashes
                                    alt="Purchase Request"
                                    className="w-full max-w-md rounded shadow-md"
                                />
                            </div>
                        ))}
                </div>

                {/* 🔹 Tampilkan Data Offer Price */}
                <div className="bg-blue-100 p-4 rounded mb-4">
                    <h2 className="text-lg font-semibold">
                        Detail Offer Price
                    </h2>
                    <p>
                        <strong>Harga Layanan:</strong> Rp{" "}
                        {offerPrice.service_price}
                    </p>
                    <p>
                        <strong>DP yang Harus Dibayar:</strong> Rp{" "}
                        {offerPrice.dp_amount}
                    </p>
                    <p>
                        <strong>Status:</strong> {offerPrice.status}
                    </p>
                </div>

                {/* 🔹 Form Pembayaran DP */}
                <form
                    onSubmit={submit}
                    className="mt-4 bg-white p-4 shadow rounded"
                >
                    <input
                        type="hidden"
                        name="offerprice_id"
                        value={data.offerprice_id}
                    />

                    <div className="mb-4">
                        <label className="block font-bold">
                            Jumlah DP (Rp)
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={data.amount}
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold">
                            Metode Pembayaran
                        </label>
                        <select
                            className="w-full p-2 border rounded"
                            value={data.payment_method}
                            onChange={(e) =>
                                setData("payment_method", e.target.value)
                            }
                        >
                            <option value="">Pilih Metode</option>
                            <option value="bank_transfer">Transfer Bank</option>
                            <option value="ewallet">E-Wallet</option>
                            <option value="tunai">Bayar Langsung / Cash</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">
                        Bayar DP
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
