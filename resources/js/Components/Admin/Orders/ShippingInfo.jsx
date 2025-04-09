import React from "react";
import { Truck } from "lucide-react";

export default function ShippingInfo({ shipping, purchaseRequest }) {
    const formatAddress = (address) => {
        if (!address) return "Tidak ada alamat";
        return `${address.address}, ${address.subdistrict_name}, ${address.district_name}, ${address.city_name}, ${address.province_name} ${address.zip_code}`;
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <Truck size={20} className="mr-2 text-blue-500" />
                Informasi Pengiriman
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-600">
                <div className="space-y-2">
                    <p>
                        <strong>Kurir:</strong> {shipping.courier_name} (
                        {shipping.courier_service})
                    </p>
                    <p>
                        <strong>Nomor Resi:</strong>{" "}
                        {shipping.tracking_number || "Belum Ditambahkan"}
                    </p>
                    <p>
                        <strong>Tanggal Pengiriman:</strong>{" "}
                        {shipping.shipping_date || "Belum Dikirim"}
                    </p>
                </div>
                <div className="space-y-2">
                    <p>
                        <strong>Tanggal Diterima:</strong>{" "}
                        {shipping.received_date || "Belum Diterima"}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        {shipping.status === "in_transit"
                            ? "Dalam Pengiriman"
                            : "Diterima"}
                    </p>
                    <p>
                        <strong>Penerima:</strong>{" "}
                        {purchaseRequest.user.full_name}
                    </p>
                    <p>
                        <strong>Alamat:</strong>{" "}
                        {formatAddress(purchaseRequest.destination_address)}
                    </p>
                </div>
            </div>
        </section>
    );
}
