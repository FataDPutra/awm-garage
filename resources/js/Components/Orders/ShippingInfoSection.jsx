import React from "react";

export default function ShippingInfoSection({ order }) {
    if (!order.shipping) return null;

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Informasi Pengiriman
            </h3>
            <div className="space-y-2 text-gray-600">
                <p>
                    <strong>Kurir:</strong> {order.shipping.courier_code} -{" "}
                    {order.shipping.courier_name} -{" "}
                    {order.shipping.courier_service}
                </p>
                <p>
                    <strong>Nomor Resi:</strong>{" "}
                    {order.shipping.tracking_number || "Belum Ditambahkan"}
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
                    <strong>Penerima:</strong>{" "}
                    {order.offer_price.purchase_request.user.full_name}
                </p>
                <p>
                    <strong>Alamat Penerima:</strong>
                    <br />
                    {order.offer_price.purchase_request.user.phone}
                    <br />
                    {
                        order.offer_price.purchase_request.destination_address
                            .address
                    }
                    <br />
                    {
                        order.offer_price.purchase_request.destination_address
                            .subdistrict_name
                    }
                    ,{" "}
                    {
                        order.offer_price.purchase_request.destination_address
                            .district_name
                    }
                    <br />
                    {
                        order.offer_price.purchase_request.destination_address
                            .city_name
                    }
                    ,{" "}
                    {
                        order.offer_price.purchase_request.destination_address
                            .province_name
                    }
                    <br />
                    {
                        order.offer_price.purchase_request.destination_address
                            .zip_code
                    }
                    <br />
                    {
                        order.offer_price.purchase_request.destination_address
                            .address_details
                    }
                </p>
            </div>
        </div>
    );
}
