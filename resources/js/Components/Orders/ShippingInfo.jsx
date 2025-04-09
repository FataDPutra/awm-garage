import React from "react";

export default function ShippingInfo({ shipping }) {
    return (
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-green-900 mb-6 border-b pb-2 border-green-200">
                Informasi Pengiriman
            </h3>
            <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Kurir:
                    </strong>{" "}
                    <span className="text-green-700 font-medium">
                        {shipping.courier_code} - {shipping.courier_name} -{" "}
                        {shipping.courier_service}
                    </span>
                </p>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Nomor Resi:
                    </strong>{" "}
                    <span className="text-green-700 font-medium">
                        {shipping.tracking_number || "Belum Ditambahkan"}
                    </span>
                </p>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Tanggal Pengiriman:
                    </strong>{" "}
                    {shipping.shipping_date
                        ? new Date(shipping.shipping_date).toLocaleDateString(
                              "id-ID"
                          )
                        : "Belum Dikirim"}
                </p>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Tanggal Diterima:
                    </strong>{" "}
                    {shipping.received_date
                        ? new Date(shipping.received_date).toLocaleDateString(
                              "id-ID"
                          )
                        : "Belum Diterima"}
                </p>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Status:
                    </strong>{" "}
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 shadow-sm">
                        {shipping.status === "in_transit"
                            ? "Dalam Pengiriman"
                            : "Diterima"}
                    </span>
                </p>
            </div>
        </div>
    );
}
