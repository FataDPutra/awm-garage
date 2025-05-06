import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";

export default function CreateDP({
    offerPrice,
    purchaseRequest,
    midtransClientKey,
    snapToken,
}) {
    const { data, setData, post, errors } = useForm({
        offerprice_id: offerPrice.id,
        amount: offerPrice.dp_amount,
    });

    useEffect(() => {
        if (snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    console.log("Payment success:", result);
                    window.location.href = route("purchase_requests.index");
                },
                onPending: function (result) {
                    console.log("Payment pending:", result);
                },
                onError: function (result) {
                    console.error("Payment error:", result);
                },
                onClose: function () {
                    console.log("Payment popup closed");
                },
            });
        }
    }, [snapToken]);

    const submit = (e) => {
        e.preventDefault();
        post(`/payments/${data.offerprice_id}/payment-dp`, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pembayaran DP">
                <script
                    type="text/javascript"
                    // src="https://app.sandbox.midtrans.com/snap/snap.js"
                    src="https://app.midtrans.com/snap/snap.js"
                    data-client-key={midtransClientKey}
                ></script>
            </Head>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Pembayaran DP</h1>

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
                        {purchaseRequest.shipping_cost_to_admin}
                    </p>
                    <p>
                        <strong>Status:</strong> {purchaseRequest.status}
                    </p>
                    {purchaseRequest.photo_path &&
                        (Array.isArray(purchaseRequest.photo_path) ? (
                            purchaseRequest.photo_path.map((photo, index) => (
                                <div className="mb-4" key={index}>
                                    <img
                                        src={`/storage/${photo.replace(
                                            /\\/g,
                                            ""
                                        )}`}
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
                                    )}`}
                                    alt="Purchase Request"
                                    className="w-full max-w-md rounded shadow-md"
                                />
                            </div>
                        ))}
                </div>

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
                    <button
                        type="submit"
                        className="btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Bayar DP
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
