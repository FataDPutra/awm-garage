import React, { useState } from "react";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import { PlusCircle, XCircle, Save } from "lucide-react";
import heic2any from "heic2any";
import Compressor from "compressorjs";

export default function AdditionalForm({
    data,
    setData,
    additionalTypes,
    onAddType,
}) {
    const [showAdditionalForm, setShowAdditionalForm] = useState(false);
    const [newTypeInput, setNewTypeInput] = useState(false);
    const [additional, setAdditional] = useState({
        additional_type_id: "",
        new_type: "",
        name: "",
        image: null,
        additional_price: "",
        preview: null,
    });

    const isHeicFile = (file) => {
        const isHeic = ["image/heic", "image/heif"].includes(file.type);
        if (isHeic && !navigator.userAgent.includes("Chrome")) {
            alert(
                "File HEIC/HEIF hanya didukung di Chrome. Silakan konversi ke JPEG/PNG di browser lain."
            );
            return false;
        }
        return isHeic;
    };

    const convertHeicToJpeg = async (file) => {
        console.log(`Mengkonversi ${file.name} ke JPEG`);
        try {
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8,
            });
            return new File(
                [convertedBlob],
                file.name.replace(/\.heic$/i, ".jpg"),
                {
                    type: "image/jpeg",
                }
            );
        } catch (error) {
            console.error("Error converting HEIC to JPEG:", error);
            alert(
                "Gagal mengkonversi file HEIC. Silakan coba lagi atau gunakan format lain."
            );
            return null;
        }
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            new Compressor(file, {
                quality: 0.8,
                maxWidth: 1920,
                maxHeight: 1920,
                mimeType: "image/jpeg",
                success(result) {
                    console.log(`File ${result.name} berhasil dikompresi`);
                    resolve(result);
                },
                error(error) {
                    console.error("Error compressing image:", error);
                    resolve(file);
                },
            });
        });
    };

    const handleImageChange = async (file) => {
        if (!file) return;

        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/heic",
            "image/heif",
        ];
        if (!validTypes.includes(file.type)) {
            alert(
                "Format gambar tidak didukung. Gunakan JPEG, PNG, JPG, GIF, HEIC, atau HEIF."
            );
            return;
        }

        let processedFile = file;
        if (isHeicFile(file)) {
            processedFile = await convertHeicToJpeg(file);
            if (!processedFile) return;
        }

        processedFile = await compressImage(processedFile);
        const previewUrl = URL.createObjectURL(processedFile);
        setAdditional({
            ...additional,
            image: processedFile,
            preview: previewUrl,
        });
        console.log("Image selected:", {
            name: processedFile.name,
            size: processedFile.size,
            type: processedFile.type,
        });
    };

    const handleImageRemove = () => {
        if (additional.preview) URL.revokeObjectURL(additional.preview);
        setAdditional({ ...additional, image: null, preview: null });
        console.log("Image removed");
    };

    const handleAddAdditional = () => {
        if (
            (additional.additional_type_id || additional.new_type) &&
            additional.name
        ) {
            const newAdditional = {
                ...additional,
                additional_type_id: additional.additional_type_id
                    ? parseInt(additional.additional_type_id, 10)
                    : "",
                image: additional.image,
                preview: additional.preview,
            };
            setData("additionals", [...data.additionals, newAdditional]);
            setAdditional({
                additional_type_id: "",
                new_type: "",
                name: "",
                image: null,
                additional_price: "",
                preview: null,
            });
            setNewTypeInput(false);
            setShowAdditionalForm(false);
            console.log("Additional added:", {
                additional_type_id: newAdditional.additional_type_id,
                additional_type_id_type:
                    typeof newAdditional.additional_type_id,
                new_type: newAdditional.new_type,
                name: newAdditional.name,
                additional_price: newAdditional.additional_price,
            });
        } else {
            alert(
                "Harap isi kolom Tipe (atau Tipe Baru) dan Nama untuk tambahan."
            );
        }
    };

    const handleSaveNewType = async (newType) => {
        if (!newType) {
            alert("Harap masukkan nama tipe baru.");
            return;
        }
        if (
            additionalTypes.some(
                (t) => t.name.toLowerCase() === newType.toLowerCase()
            )
        ) {
            alert("Tipe ini sudah ada.");
            return;
        }

        try {
            const response = await axios.post(route("additional-types.store"), {
                name: newType,
            });
            const savedType = response.data;
            onAddType(savedType); // Kirim tipe baru ke CreateService
            setAdditional({
                ...additional,
                additional_type_id: savedType.id,
                new_type: "",
            });
            setNewTypeInput(false);
            console.log("New type saved:", savedType);
        } catch (error) {
            console.error("Error saving new type:", error);
            alert(
                "Gagal menyimpan tipe baru: " +
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
                                                new_type: "",
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
                                                additional_type_id: "",
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
                                onClick={() => {
                                    setShowAdditionalForm(false);
                                    setNewTypeInput(false);
                                    handleImageRemove();
                                }}
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
