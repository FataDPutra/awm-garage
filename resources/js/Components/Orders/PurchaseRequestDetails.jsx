import React from "react";

export default function PurchaseRequestDetails({ purchaseRequest }) {
    const {
        description,
        weight,
        source_address,
        destination_address,
        additional_details,
    } = purchaseRequest;

    return (
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-teal-900 mb-6 border-b pb-2 border-teal-200">
                Detail Permintaan Pesanan
            </h3>
            <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Deskripsi:
                    </strong>{" "}
                    {description || "Tidak ada deskripsi tambahan"}
                </p>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Berat:
                    </strong>{" "}
                    {weight ? `${weight} kg` : "Tidak ditentukan"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-700 text-lg">
                            <strong className="font-semibold text-gray-800">
                                Alamat Asal:
                            </strong>
                        </p>
                        <p className="text-gray-600 bg-white p-3 rounded-lg shadow-sm">
                            {source_address.address || "N/A"},{" "}
                            {source_address.subdistrict_name || ""},{" "}
                            {source_address.district_name || ""},{" "}
                            {source_address.city_name || ""},{" "}
                            {source_address.province_name || ""},{" "}
                            {source_address.zip_code || ""}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-700 text-lg">
                            <strong className="font-semibold text-gray-800">
                                Alamat Tujuan:
                            </strong>
                        </p>
                        <p className="text-gray-600 bg-white p-3 rounded-lg shadow-sm">
                            {destination_address.address || "N/A"},{" "}
                            {destination_address.subdistrict_name || ""},{" "}
                            {destination_address.district_name || ""},{" "}
                            {destination_address.city_name || ""},{" "}
                            {destination_address.province_name || ""},{" "}
                            {destination_address.zip_code || ""}
                        </p>
                    </div>
                </div>
                <p className="text-gray-700 text-lg">
                    <strong className="font-semibold text-gray-800">
                        Detail Tambahan:
                    </strong>{" "}
                    {additional_details?.length > 0
                        ? additional_details.join(", ")
                        : "Tidak ada detail tambahan"}
                </p>
            </div>
        </div>
    );
}
