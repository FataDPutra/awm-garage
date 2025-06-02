import React from "react";
import { Truck } from "lucide-react";

const ShippingOptions = ({
    label,
    type,
    data,
    shippingOptions,
    handleShippingOptionChange,
    isCalculatingShipping,
    formErrors,
}) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <Truck size={20} className="mr-2 text-blue-500" /> {label}
        </label>
        {isCalculatingShipping ? (
            <p className="text-gray-500">Menghitung opsi pengiriman...</p>
        ) : shippingOptions.length === 0 ? (
            <p className="text-red-500 text-sm">
                Tidak ada opsi pengiriman tersedia. Pastikan alamat tujuan dan
                berat barang valid.
            </p>
        ) : (
            <select
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                value={
                    data[type] ? `${data[type].code}|${data[type].service}` : ""
                }
                onChange={(e) =>
                    handleShippingOptionChange(
                        type === "shipping_to_admin_selection"
                            ? "to_admin"
                            : "to_customer",
                        e
                    )
                }
                required
                disabled={isCalculatingShipping || shippingOptions.length === 0}
            >
                <option value="">Pilih {label.toLowerCase()}</option>
                {shippingOptions.map((option) => (
                    <option
                        key={`${option.code}|${option.service}`}
                        value={`${option.code}|${option.service}`}
                    >
                        {option.name} - {option.service} ({option.cost} Rp, ETD:{" "}
                        {option.etd || "N/A"})
                    </option>
                ))}
            </select>
        )}
        {formErrors[type] && (
            <p className="text-red-500 text-sm">{formErrors[type]}</p>
        )}
    </div>
);

export default ShippingOptions;
