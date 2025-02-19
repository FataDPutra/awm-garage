import React from "react";
import { Head } from "@inertiajs/react";
import Layout from "../../Components/Layout";

export default function Show({ shipping }) {
    return (
        <Layout>
            <Head title={`Detail Pengiriman #${shipping.shipping_id}`} />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Detail Pengiriman</h1>
                <p>
                    <strong>Kurir:</strong> {shipping.courier_service}
                </p>
                <p>
                    <strong>Resi:</strong> {shipping.tracking_number}
                </p>
                <p>
                    <strong>Status:</strong>{" "}
                    {shipping.status === "delivered"
                        ? "Diterima"
                        : "Sedang Dikirim"}
                </p>
            </div>
        </Layout>
    );
}
