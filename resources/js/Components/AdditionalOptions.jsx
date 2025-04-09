import React from "react";
import { Plus } from "lucide-react";

const AdditionalOptions = ({
    availableAdditionals,
    data,
    setData,
    formErrors,
    handleAdditionalChange,
}) => (
    <div className="space-y-2">
        <label className="block font-semibold text-gray-700 flex items-center">
            <Plus size={20} className="mr-2 text-blue-500" /> Opsi Tambahan
        </label>
        {availableAdditionals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableAdditionals.map((add) => (
                    <label
                        key={add.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                    >
                        <input
                            type="checkbox"
                            value={add.id}
                            checked={data.additionals.some(
                                (a) => a.id === add.id
                            )}
                            onChange={handleAdditionalChange}
                            className="h-5 w-5 text-blue-500"
                        />
                        <div className="flex-1">
                            {add.name}{" "}
                            <span className="text-green-600">
                                +{add.additional_price} Rp
                            </span>
                        </div>
                        {add.image_path && (
                            <img
                                src={`/storage/${add.image_path}`}
                                alt={add.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                        )}
                    </label>
                ))}
            </div>
        ) : (
            <p className="text-gray-500">
                Tidak ada opsi tambahan untuk layanan ini.
            </p>
        )}
        {formErrors.additionals && (
            <p className="text-red-500 text-sm">{formErrors.additionals}</p>
        )}
    </div>
);

export default AdditionalOptions;
