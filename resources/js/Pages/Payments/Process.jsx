import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Process({ auth, snapToken, paymentId }) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute(
            "data-client-key",
            process.env.REACT_APP_MIDTRANS_CLIENT_KEY
        );
        document.body.appendChild(script);

        script.onload = () => {
            window.snap.pay(snapToken, {
                onSuccess: (result) => {
                    console.log("Payment success:", result);
                    window.location.href = "/purchase_requests";
                },
                onPending: (result) => {
                    console.log("Payment pending:", result);
                },
                onError: (result) => {
                    console.error("Payment error:", result);
                },
                onClose: () => {
                    console.log("Payment popup closed");
                },
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [snapToken]);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Proses Pembayaran" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">
                        Memproses Pembayaran...
                    </h1>
                    <p>Silakan selesaikan pembayaran Anda.</p>
                    <div id="snap-container"></div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
