import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Show({ purchaseRequest }) {
    const { data, setData, post } = useForm({
        service_price: "",
        dp_amount: "",
        estimation_days: "",
        total_price: "",
    });

    const submitOffer = (e) => {
        e.preventDefault();
        post(route("admin.purchaserequests.offer", purchaseRequest.id));
    };

    return (
        <div>
            <h1>Detail Purchase Request</h1>
            <p>ID: {purchaseRequest.id}</p>
            <p>Customer: {purchaseRequest.user.full_name}</p>
            <p>Service: {purchaseRequest.service.service_name}</p>
            <p>Description: {purchaseRequest.description}</p>
            <p>Status: {purchaseRequest.status}</p>

            {/* Menampilkan foto jika ada */}
            {purchaseRequest.photo_path &&
                (Array.isArray(purchaseRequest.photo_path) ? (
                    purchaseRequest.photo_path.map((photo, index) => (
                        <div className="mb-4" key={index}>
                            <img
                                src={`/storage/${photo.replace(/\\/g, "")}`} // Remove any backslashes
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

            {purchaseRequest.offer_price ? (
                <div>
                    <h2>Offer Price</h2>
                    <p>Harga: {purchaseRequest.offer_price.service_price}</p>
                    <p>DP: {purchaseRequest.offer_price.dp_amount}</p>
                    <p>
                        Estimasi: {purchaseRequest.offer_price.estimation_days}{" "}
                        hari
                    </p>
                </div>
            ) : (
                <form onSubmit={submitOffer}>
                    <h2>Berikan Offer Price</h2>
                    <input
                        type="number"
                        placeholder="Harga Jasa"
                        value={data.service_price}
                        onChange={(e) =>
                            setData("service_price", e.target.value)
                        }
                    />
                    <input
                        type="number"
                        placeholder="DP Amount"
                        value={data.dp_amount}
                        onChange={(e) => setData("dp_amount", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Estimasi Hari"
                        value={data.estimation_days}
                        onChange={(e) =>
                            setData("estimation_days", e.target.value)
                        }
                    />
                    <input
                        type="number"
                        placeholder="Total Price"
                        value={data.total_price}
                        onChange={(e) => setData("total_price", e.target.value)}
                    />
                    <button type="submit">Kirim Penawaran</button>
                </form>
            )}
        </div>
    );
}
