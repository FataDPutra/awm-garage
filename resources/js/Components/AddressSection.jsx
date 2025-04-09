import React from "react";
import { MapPin } from "lucide-react";

const AddressSection = ({
    type,
    label,
    data,
    setData,
    search,
    setSearch,
    locations,
    setLocations,
    formErrors,
    handleLocationSelect,
    handleAddressChange,
    resetAddress,
}) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <MapPin size={20} className="mr-2 text-blue-500" /> {label}
        </label>
        <p className="text-gray-600 text-sm mb-2">
            Digunakan untuk menghitung estimasi biaya pengiriman
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name={`${type}_option`}
                    checked={data[`${type}_use_account_address`]}
                    onChange={() =>
                        setData(`${type}_use_account_address`, true)
                    }
                    className="h-5 w-5 text-blue-500"
                />
                Gunakan alamat akun saya
            </label>
            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name={`${type}_option`}
                    checked={!data[`${type}_use_account_address`]}
                    onChange={() => {
                        setData(`${type}_use_account_address`, false);
                        resetAddress(type);
                    }}
                    className="h-5 w-5 text-blue-500"
                />
                Masukkan alamat baru
            </label>
        </div>
        {!data[`${type}_use_account_address`] && (
            <div className="mt-4 space-y-4 relative">
                <input
                    type="text"
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Cari lokasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {locations.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg shadow-lg bg-white max-h-60 overflow-auto">
                        {locations.map((loc) => (
                            <li
                                key={loc.id}
                                className="p-3 cursor-pointer hover:bg-blue-50 transition-all"
                                onClick={() => handleLocationSelect(type, loc)}
                            >
                                {loc.label}
                            </li>
                        ))}
                    </ul>
                )}
                <input
                    type="text"
                    className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700"
                    placeholder="Alamat"
                    value={data[type].address}
                    disabled
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700"
                        placeholder="Provinsi"
                        value={data[type].province_name}
                        disabled
                    />
                    <input
                        type="text"
                        className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700"
                        placeholder="Kota"
                        value={data[type].city_name}
                        disabled
                    />
                    <input
                        type="text"
                        className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700"
                        placeholder="Kecamatan"
                        value={data[type].district_name}
                        disabled
                    />
                    <input
                        type="text"
                        className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700"
                        placeholder="Kelurahan"
                        value={data[type].subdistrict_name}
                        disabled
                    />
                </div>
                <input
                    type="text"
                    className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700"
                    placeholder="Kode Pos"
                    value={data[type].zip_code}
                    disabled
                />
                <textarea
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                    placeholder="Detail Alamat (contoh: nomor rumah, nama jalan)"
                    value={data[type].address_details}
                    onChange={(e) =>
                        handleAddressChange(
                            type,
                            "address_details",
                            e.target.value
                        )
                    }
                    rows="3"
                />
                {formErrors[`${type}.zip_code`] && (
                    <p className="text-red-500 text-sm">
                        {formErrors[`${type}.zip_code`]}
                    </p>
                )}
            </div>
        )}
    </div>
);

export default AddressSection;
