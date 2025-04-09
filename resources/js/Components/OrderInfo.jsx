import React from "react";
import {
    Package,
    MapPin,
    Truck,
    PlusSquare,
    HandCoins,
    Weight,
    Paintbrush,
    Notebook,
} from "lucide-react";

const OrderInfo = ({ purchaseRequest, formatCurrency }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Package size={20} className="mr-2 text-blue-500" /> Informasi
                Pesanan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div>
                    <p className="flex items-start">
                        <Paintbrush
                            size={16}
                            className="mr-2 mt-1 text-blue-500"
                        />
                        <span>
                            {" "}
                            <strong>Layanan:</strong>{" "}
                            {purchaseRequest.service?.service_name ||
                                "Tidak ada"}
                        </span>
                    </p>
                    <p className="flex items-start">
                        <Notebook
                            size={16}
                            className="mr-2 mt-1 text-blue-500"
                        />
                        <span>
                            {" "}
                            <strong>Deskripsi:</strong>{" "}
                            {purchaseRequest.description ||
                                "Tidak ada deskripsi"}
                        </span>
                    </p>
                    <p className="flex items-start">
                        <Weight size={16} className="mr-2 mt-1 text-blue-500" />
                        <span>
                            <strong>Berat Barang:</strong>{" "}
                            {purchaseRequest.weight} kg
                        </span>
                    </p>
                    <p className="flex items-start">
                        <HandCoins
                            size={16}
                            className="mr-2 mt-1 text-blue-500"
                        />
                        <span>
                            <strong>Biaya Kirim ke Admin:</strong>{" "}
                            {formatCurrency(
                                purchaseRequest.shipping_cost_to_admin
                            )}
                        </span>
                    </p>
                    <p className="flex items-start">
                        <Truck size={16} className="mr-2 mt-1 text-blue-500" />
                        <span>
                            <strong>Jasa Kirim ke Admin:</strong> <br />
                            {purchaseRequest.shipping_to_admin_details?.name ||
                                "Tidak ada"}{" "}
                            -{" "}
                            {purchaseRequest.shipping_to_admin_details
                                ?.service || ""}{" "}
                            (Estimasi:{" "}
                            {purchaseRequest.shipping_to_admin_details?.etd ||
                                "Tidak tersedia"}
                            )
                        </span>
                    </p>
                </div>
                <div>
                    <p className="flex items-start">
                        <MapPin size={16} className="mr-2 mt-1 text-blue-500" />
                        <span>
                            <strong>Alamat Pengirim:</strong> <br />
                            {purchaseRequest.source_address.address} <br />
                            {
                                purchaseRequest.source_address.subdistrict_name
                            }, {purchaseRequest.source_address.district_name}{" "}
                            <br />
                            {purchaseRequest.source_address.province_name}{" "}
                            <br />
                            {purchaseRequest.source_address.address_details}
                        </span>
                    </p>
                </div>
                <div>
                    <p className="flex items-start">
                        <MapPin size={16} className="mr-2 mt-1 text-blue-500" />
                        <span>
                            <strong>Alamat Tujuan:</strong> <br />
                            {purchaseRequest.destination_address.address} <br />
                            {
                                purchaseRequest.destination_address
                                    .subdistrict_name
                            }
                            ,{" "}
                            {purchaseRequest.destination_address.district_name}{" "}
                            <br />
                            {
                                purchaseRequest.destination_address
                                    .province_name
                            }{" "}
                            <br />
                            {
                                purchaseRequest.destination_address
                                    .address_details
                            }
                        </span>
                    </p>
                </div>
                <div>
                    <p className="flex items-start">
                        <Truck size={16} className="mr-2 mt-1 text-blue-500" />
                        <span>
                            <strong>Pilihan Pengiriman ke Alamat Anda: </strong>{" "}
                            <br />
                            {purchaseRequest.shipping_to_customer_preference
                                ?.name || "Tidak ada"}{" "}
                            -{" "}
                            {purchaseRequest.shipping_to_customer_preference
                                ?.service || ""}{" "}
                            (
                            {formatCurrency(
                                purchaseRequest.shipping_to_customer_preference
                                    ?.cost || 0
                            )}
                            , Estimasi:{" "}
                            {purchaseRequest.shipping_to_customer_preference
                                ?.etd || "Tidak tersedia"}
                            )
                        </span>
                    </p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                    <p className="flex items-start">
                        <PlusSquare
                            size={16}
                            className="mr-2 mt-1 text-blue-500"
                        />
                        <span>
                            <strong>Opsi Tambahan:</strong>
                        </span>
                    </p>
                    {purchaseRequest.additional_details &&
                    purchaseRequest.additional_details.length > 0 ? (
                        <ul className="list-disc pl-5 mt-1">
                            {purchaseRequest.additional_details.map(
                                (add, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        {add.name} (
                                        {formatCurrency(add.additional_price)})
                                        {add.image_path && (
                                            <img
                                                src={`/storage/${add.image_path}`}
                                                alt={add.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        )}
                                    </li>
                                )
                            )}
                        </ul>
                    ) : (
                        <p className="text-gray-500">
                            Tidak ada opsi tambahan yang dipilih
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;
