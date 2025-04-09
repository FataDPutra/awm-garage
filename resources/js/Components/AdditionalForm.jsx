import React, { useState } from "react";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import { PlusCircle, XCircle, Save } from "lucide-react";

export default function AdditionalForm({
    data,
    setData,
    additionalTypes: initialTypes,
}) {
    const [showAdditionalForm, setShowAdditionalForm] = useState(false);
    const [newTypeInput, setNewTypeInput] = useState(false);
    const [additionalTypes, setAdditionalTypes] = useState(initialTypes);
    const [additional, setAdditional] = useState({
        additional_type_id: "",
        name: "",
        image: null,
        additional_price: "",
        preview: null,
    });

    const handleAddAdditional = () => {
        if (additional.additional_type_id && additional.name) {
            setData("additionals", [
                ...data.additionals,
                {
                    ...additional,
                    image: additional.image,
                    preview: additional.preview,
                },
            ]);
            setAdditional({
                additional_type_id: "",
                name: "",
                image: null,
                additional_price: "",
                preview: null,
            });
            setNewTypeInput(false);
            setShowAdditionalForm(false);
        } else {
            alert(
                "Please fill in the required fields (Type and Name) for the additional."
            );
        }
    };

    const handleImageChange = (file) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAdditional({ ...additional, image: file, preview: previewUrl });
        }
    };

    const handleImageRemove = () => {
        if (additional.preview) URL.revokeObjectURL(additional.preview);
        setAdditional({ ...additional, image: null, preview: null });
    };

    const handleSaveNewType = async (newType) => {
        if (!newType) {
            alert("Please enter a new type name.");
            return;
        }
        if (additionalTypes.some((t) => t.name === newType)) {
            alert("This type already exists.");
            return;
        }

        try {
            const response = await axios.post(route("additional-types.store"), {
                name: newType,
            });
            const savedType = response.data;
            setAdditionalTypes([...additionalTypes, savedType]);
            setAdditional({ ...additional, additional_type_id: savedType.id });
            setNewTypeInput(false);
        } catch (error) {
            alert(
                "Failed to save new type: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    return (
        <div>
            {!showAdditionalForm && (
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setShowAdditionalForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <PlusCircle size={18} /> Tambah Additional
                    </button>
                </div>
            )}
            {showAdditionalForm && (
                <div className="border p-4 rounded-lg bg-gray-50 mt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                        Tambah Additional
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Tipe
                            </label>
                            {!newTypeInput ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <select
                                        value={additional.additional_type_id}
                                        onChange={(e) =>
                                            setAdditional({
                                                ...additional,
                                                additional_type_id:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        <option value="">
                                            Pilih Tipe yang Ada
                                        </option>
                                        {additionalTypes.map((type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setNewTypeInput(true)}
                                        className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <PlusCircle size={18} /> Tipe Baru
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={additional.new_type || ""}
                                        onChange={(e) =>
                                            setAdditional({
                                                ...additional,
                                                new_type: e.target.value,
                                            })
                                        }
                                        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Masukkan tipe baru (e.g., Material)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSaveNewType(
                                                additional.new_type
                                            )
                                        }
                                        className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <Save size={18} /> Simpan Tipe
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={additional.name}
                                onChange={(e) =>
                                    setAdditional({
                                        ...additional,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Gambar
                            </label>
                            <ImageUpload
                                onImageChange={handleImageChange}
                                onImageRemove={handleImageRemove}
                                preview={additional.preview}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Harga Tambahan (Rp)
                            </label>
                            <input
                                type="number"
                                value={additional.additional_price}
                                onChange={(e) =>
                                    setAdditional({
                                        ...additional,
                                        additional_price: e.target.value,
                                    })
                                }
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                min="0"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleAddAdditional}
                                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <PlusCircle size={18} /> Tambah
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAdditionalForm(false)}
                                className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <XCircle size={18} /> Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
