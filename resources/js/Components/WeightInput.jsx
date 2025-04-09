import React from "react";
import { Package } from "lucide-react";

const WeightInput = ({ data, setData, formErrors }) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <Package size={20} className="mr-2 text-blue-500" /> Berat (kg)
        </label>
        <input
            type="number"
            step="0.01"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
            value={data.weight}
            onChange={(e) => {
                const value = e.target.value;
                if (value <= 999.99) setData("weight", value);
                else alert("Berat maksimum adalah 999.99 kg");
            }}
            required
            min="0.1"
            max="999.99"
            placeholder="Masukkan berat (misal: 1.5)"
        />
        {formErrors.weight && (
            <p className="text-red-500 text-sm">{formErrors.weight}</p>
        )}
    </div>
);

export default WeightInput;
