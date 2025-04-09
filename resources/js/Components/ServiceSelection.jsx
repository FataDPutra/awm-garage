import React from "react";
import { Paintbrush } from "lucide-react";

const ServiceSelection = ({ services, data, setData, formErrors }) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <Paintbrush size={20} className="mr-2 text-blue-500" /> Layanan
        </label>
        <select
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
            value={data.service_id}
            onChange={(e) => setData("service_id", e.target.value)}
            required
        >
            <option value="">Pilih Layanan</option>
            {services.map((service) => (
                <option key={service.id} value={service.id}>
                    {service.service_name}
                </option>
            ))}
        </select>
        {formErrors.service_id && (
            <p className="text-red-500 text-sm">{formErrors.service_id}</p>
        )}
    </div>
);

export default ServiceSelection;
