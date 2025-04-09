import React from "react";
import { FileText } from "lucide-react";

const DescriptionInput = ({ data, setData, formErrors }) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <FileText size={20} className="mr-2 text-blue-500" /> Deskripsi
        </label>
        <textarea
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            required
            rows="5"
            placeholder="Jelaskan kebutuhan Anda..."
        />
        {formErrors.description && (
            <p className="text-red-500 text-sm">{formErrors.description}</p>
        )}
    </div>
);

export default DescriptionInput;
