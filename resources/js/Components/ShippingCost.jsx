import React from "react";
import { DollarSign } from "lucide-react";

const ShippingCost = ({ data }) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <DollarSign size={20} className="mr-2 text-blue-500" /> Biaya
            Pengiriman ke Admin (Rp)
        </label>
        <input
            type="number"
            className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700"
            value={data.shipping_cost_to_admin}
            readOnly
        />
    </div>
);

export default ShippingCost;
