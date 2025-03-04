import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

export default function Edit({ service, additionalTypes: initialTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        service_name: service.service_name || "",
        description: service.description || "",
        base_price: service.base_price || 0,
        additionals: service.additionals.map((add) => ({
            id: add.id || null,
            additional_type_id: add.additional_type_id || null,
            name: add.name || "",
            image_path: add.image_path || null,
            image: null,
            preview: add.image_path ? `/storage/${add.image_path}` : null,
            additional_price: add.additional_price || 0,
        })),
    });

    const [showAdditionalForm, setShowAdditionalForm] = useState(false);
    const [additionalTypes, setAdditionalTypes] = useState(initialTypes);
    const [newTypeInput, setNewTypeInput] = useState(false);
    const [additional, setAdditional] = useState({
        additional_type_id: "",
        name: "",
        image: null,
        additional_price: "",
        preview: null,
        new_type: "",
    });

    useEffect(() => {
        console.log("Current data state:", data);
    }, [data]);

    const handleAddAdditional = (e) => {
        e.preventDefault();
        if (
            !additional.name ||
            (!additional.additional_type_id && !additional.new_type)
        ) {
            alert("Tipe dan Nama harus diisi untuk additional!");
            return;
        }

        const newAdditional = {
            additional_type_id: additional.additional_type_id,
            name: additional.name,
            image: additional.image,
            image_path: null,
            additional_price: additional.additional_price || 0,
            preview: additional.preview,
        };

        if (additional.new_type) {
            axios
                .post(route("additional-types.store"), {
                    name: additional.new_type,
                })
                .then((response) => {
                    const savedType = response.data;
                    setData((prevData) => ({
                        ...prevData,
                        additionals: [
                            ...prevData.additionals,
                            {
                                ...newAdditional,
                                additional_type_id: savedType.id,
                            },
                        ],
                    }));
                    setAdditionalTypes([...additionalTypes, savedType]);
                    resetAdditionalForm();
                })
                .catch((error) => {
                    alert(
                        "Gagal menyimpan tipe baru: " +
                            (error.response?.data?.message || error.message)
                    );
                });
        } else {
            setData((prevData) => ({
                ...prevData,
                additionals: [...prevData.additionals, newAdditional],
            }));
            resetAdditionalForm();
        }
    };

    const resetAdditionalForm = () => {
        setAdditional({
            additional_type_id: "",
            name: "",
            image: null,
            additional_price: "",
            preview: null,
            new_type: "",
        });
        setNewTypeInput(false);
        setShowAdditionalForm(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAdditional({ ...additional, image: file, preview: previewUrl });
        }
    };

    const handleRemoveAdditional = (index) => {
        const updatedAdditionals = data.additionals.filter(
            (_, i) => i !== index
        );
        setData((prevData) => ({
            ...prevData,
            additionals: updatedAdditionals,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.service_name || !data.base_price) {
            alert("Service name dan base price harus diisi!");
            return;
        }

        const submitData = {
            service_name: data.service_name,
            description: data.description || "",
            base_price: data.base_price,
            additionals: data.additionals,
        };

        console.log("Data to be sent:", submitData);

        const hasFile = data.additionals.some(
            (add) => add.image instanceof File
        );

        if (hasFile) {
            const formData = new FormData();
            formData.append("service_name", submitData.service_name);
            formData.append("description", submitData.description);
            formData.append("base_price", submitData.base_price.toString());
            formData.append("_method", "PUT"); // Spoofing PUT

            submitData.additionals.forEach((add, index) => {
                formData.append(`additionals[${index}][id]`, add.id || "");
                formData.append(
                    `additionals[${index}][additional_type_id]`,
                    add.additional_type_id || ""
                );
                formData.append(`additionals[${index}][name]`, add.name || "");
                if (add.image instanceof File) {
                    formData.append(`additionals[${index}][image]`, add.image);
                }
                if (add.image_path) {
                    formData.append(
                        `additionals[${index}][image_path]`,
                        add.image_path
                    );
                }
                formData.append(
                    `additionals[${index}][additional_price]`,
                    (add.additional_price || 0).toString()
                );
            });

            console.log("FormData entries:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // Gunakan post untuk FormData
            post(route("services.update", service.id), {
                data: formData,
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Update success with file");
                    alert("Service berhasil diperbarui!");
                },
                onError: (errors) => {
                    console.log("Errors:", errors);
                    alert(
                        "Gagal memperbarui service: " + JSON.stringify(errors)
                    );
                },
            });
        } else {
            console.log("Sending plain data:", submitData);

            post(route("services.update", service.id), {
                data: { ...submitData, _method: "PUT" }, // Tambahkan _method untuk plain data
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Update success without file");
                    alert("Service berhasil diperbarui!");
                },
                onError: (errors) => {
                    console.log("Errors:", errors);
                    alert(
                        "Gagal memperbarui service: " + JSON.stringify(errors)
                    );
                },
            });
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Layanan</h2>
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-4"
            >
                <div>
                    <label className="block font-semibold">Nama Layanan</label>
                    <input
                        type="text"
                        value={data.service_name || ""}
                        onChange={(e) =>
                            setData("service_name", e.target.value)
                        }
                        className="border w-full p-2 rounded"
                        required
                    />
                    {errors.service_name && (
                        <p className="text-red-500 text-sm">
                            {errors.service_name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block font-semibold">Deskripsi</label>
                    <textarea
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                        className="border w-full p-2 rounded"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block font-semibold">Harga Dasar</label>
                    <input
                        type="number"
                        value={data.base_price || ""}
                        onChange={(e) => setData("base_price", e.target.value)}
                        className="border w-full p-2 rounded"
                        required
                        min="0"
                    />
                    {errors.base_price && (
                        <p className="text-red-500 text-sm">
                            {errors.base_price}
                        </p>
                    )}
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => setShowAdditionalForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Tambah Additional
                    </button>
                </div>

                {showAdditionalForm && (
                    <div className="border p-4 rounded bg-gray-50">
                        <h3 className="font-semibold mb-2">
                            Tambah Additional
                        </h3>
                        <div>
                            <label className="block font-semibold">Tipe</label>
                            {!newTypeInput ? (
                                <div className="flex gap-2">
                                    <select
                                        value={additional.additional_type_id}
                                        onChange={(e) =>
                                            setAdditional({
                                                ...additional,
                                                additional_type_id:
                                                    e.target.value,
                                            })
                                        }
                                        className="border p-2 w-full rounded"
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
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        Tipe Baru
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={additional.new_type || ""}
                                        onChange={(e) =>
                                            setAdditional({
                                                ...additional,
                                                new_type: e.target.value,
                                            })
                                        }
                                        className="border p-2 w-full rounded"
                                        placeholder="Masukkan tipe baru (e.g., Material)"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddAdditional}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Simpan Tipe
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mt-2">
                            <label className="block font-semibold">Nama</label>
                            <input
                                type="text"
                                value={additional.name || ""}
                                onChange={(e) =>
                                    setAdditional({
                                        ...additional,
                                        name: e.target.value,
                                    })
                                }
                                className="border p-2 w-full rounded"
                                required
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block font-semibold">
                                Gambar
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border p-2 w-full rounded"
                            />
                            {additional.preview && (
                                <div className="mt-2">
                                    <img
                                        src={additional.preview}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded border"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-2">
                            <label className="block font-semibold">
                                Harga Tambahan
                            </label>
                            <input
                                type="number"
                                value={additional.additional_price || ""}
                                onChange={(e) =>
                                    setAdditional({
                                        ...additional,
                                        additional_price: e.target.value,
                                    })
                                }
                                className="border p-2 w-full rounded"
                                min="0"
                            />
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={handleAddAdditional}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Tambah
                            </button>
                            <button
                                type="button"
                                onClick={resetAdditionalForm}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {data.additionals.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold">
                            Daftar Additional Saat Ini
                        </h3>
                        <div className="space-y-2">
                            {data.additionals.map((add, index) => {
                                const typeName =
                                    additionalTypes.find(
                                        (t) =>
                                            t.id ===
                                            parseInt(add.additional_type_id)
                                    )?.name || "Tidak Diketahui";
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 border p-2 rounded"
                                    >
                                        <p>Tipe: {typeName}</p>
                                        <p>Nama: {add.name}</p>
                                        <p>
                                            Harga: {add.additional_price || 0}
                                        </p>
                                        {add.preview && (
                                            <img
                                                src={add.preview}
                                                alt={`Preview ${add.name}`}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveAdditional(index)
                                            }
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </form>
        </div>
    );
}
