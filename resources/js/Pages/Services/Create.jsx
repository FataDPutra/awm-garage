import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";

export default function CreateService({ additionalTypes: initialTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        service_name: "",
        description: "",
        base_price: "",
        additionals: [],
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAdditional({ ...additional, image: file, preview: previewUrl });
        }
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
            setAdditional({
                ...additional,
                additional_type_id: savedType.id,
            });
            setNewTypeInput(false);
        } catch (error) {
            alert(
                "Failed to save new type: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("service_name", data.service_name);
        formData.append("description", data.description);
        formData.append("base_price", data.base_price);
        data.additionals.forEach((add, index) => {
            formData.append(
                `additionals[${index}][additional_type_id]`,
                add.additional_type_id
            );
            formData.append(`additionals[${index}][name]`, add.name);
            if (add.image)
                formData.append(`additionals[${index}][image]`, add.image);
            formData.append(
                `additionals[${index}][additional_price]`,
                add.additional_price || 0
            );
        });

        post(route("services.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                data.additionals.forEach((add) => {
                    if (add.preview) URL.revokeObjectURL(add.preview);
                });
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4 p-6 bg-white shadow-md rounded-lg"
        >
            <div>
                <label className="block font-semibold">Service Name</label>
                <input
                    type="text"
                    value={data.service_name}
                    onChange={(e) => setData("service_name", e.target.value)}
                    className="border p-2 w-full rounded"
                    required
                />
                {errors.service_name && (
                    <p className="text-red-500 text-sm">
                        {errors.service_name}
                    </p>
                )}
            </div>
            <div>
                <label className="block font-semibold">Description</label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="border p-2 w-full rounded"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                )}
            </div>
            <div>
                <label className="block font-semibold">Base Price</label>
                <input
                    type="number"
                    value={data.base_price}
                    onChange={(e) => setData("base_price", e.target.value)}
                    className="border p-2 w-full rounded"
                    required
                    min="0"
                />
                {errors.base_price && (
                    <p className="text-red-500 text-sm">{errors.base_price}</p>
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
                    <h3 className="font-semibold mb-2">Add Additional</h3>
                    <div>
                        <label className="block font-semibold">Type</label>
                        {!newTypeInput ? (
                            <div className="flex gap-2">
                                <select
                                    value={additional.additional_type_id}
                                    onChange={(e) =>
                                        setAdditional({
                                            ...additional,
                                            additional_type_id: e.target.value,
                                        })
                                    }
                                    className="border p-2 w-full rounded"
                                >
                                    <option value="">
                                        Select Existing Type
                                    </option>
                                    {additionalTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setNewTypeInput(true)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    New Type
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={additional.new_type}
                                    onChange={(e) =>
                                        setAdditional({
                                            ...additional,
                                            new_type: e.target.value,
                                        })
                                    }
                                    className="border p-2 w-full rounded"
                                    placeholder="Enter new type (e.g., Material)"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSaveNewType(additional.new_type)
                                    }
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Save Type
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <label className="block font-semibold">Name</label>
                        <input
                            type="text"
                            value={additional.name}
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
                        <label className="block font-semibold">Image</label>
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
                            Additional Price
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
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAdditionalForm(false);
                                setNewTypeInput(false);
                                setAdditional({ ...additional, new_type: "" });
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {data.additionals.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold">Added Additionals</h3>
                    <div className="space-y-2">
                        {data.additionals.map((add, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 border p-2 rounded"
                            >
                                <p>
                                    Type:{" "}
                                    {
                                        additionalTypes.find(
                                            (t) =>
                                                t.id === add.additional_type_id
                                        )?.name
                                    }
                                </p>
                                <p>Name: {add.name}</p>
                                <p>Price: {add.additional_price || 0}</p>
                                {add.preview && (
                                    <img
                                        src={add.preview}
                                        alt={`Preview ${add.name}`}
                                        className="w-16 h-16 object-cover rounded border"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={processing}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Save Service
            </button>
        </form>
    );
}
