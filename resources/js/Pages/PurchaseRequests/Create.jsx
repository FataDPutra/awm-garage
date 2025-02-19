import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";

export default function Create() {
    const { services } = usePage().props;
    const { data, setData, post, errors, processing } = useForm({
        service_id: "",
        description: "",
        photos: [], // Array untuk menyimpan file foto
        weight: "",
        shipping_cost: "",
    });

    const [photoPreviews, setPhotoPreviews] = useState([]); // State untuk menyimpan URL preview foto

    // Fungsi untuk menambahkan foto
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // Validasi file
        const validFiles = files.filter((file) => {
            const isValidType = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
            ].includes(file.type);
            const isValidSize = file.size <= 2 * 1024 * 1024; // Maksimal 2MB
            return isValidType && isValidSize;
        });

        // Tambahkan file baru ke state
        const newPhotos = [...data.photos, ...validFiles];
        setData("photos", newPhotos);

        // Buat URL preview untuk file baru
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPhotoPreviews([...photoPreviews, ...newPreviews]);
    };

    // Fungsi untuk menghapus foto
    const handleRemovePhoto = (index) => {
        const updatedPhotos = data.photos.filter((_, i) => i !== index);
        const updatedPreviews = photoPreviews.filter((_, i) => i !== index);

        setData("photos", updatedPhotos);
        setPhotoPreviews(updatedPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("service_id", data.service_id);
        formData.append("description", data.description);
        formData.append("weight", data.weight);
        formData.append("shipping_cost", data.shipping_cost);

        // Tambahkan semua foto ke FormData
        data.photos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo);
        });

        post(route("purchase_requests.store"), {
            data: formData,
            forceFormData: true, // Pastikan data dikirim sebagai FormData
            onSuccess: () => {
                alert("Purchase Request berhasil dibuat!");
            },
            onError: (errors) => {
                alert(
                    "Gagal membuat Purchase Request. Silakan cek kembali data yang diinput."
                );
            },
        });
    };

    return (
        <div className="container mx-auto p-6">
            <Head title="Create Purchase Request" />

            <h1 className="text-2xl font-bold mb-4">Create Purchase Request</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 shadow-md rounded-lg"
                encType="multipart/form-data"
            >
                <div className="mb-4">
                    <label className="block font-semibold">Service</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={data.service_id}
                        onChange={(e) => setData("service_id", e.target.value)}
                        required
                    >
                        <option value="">Select Service</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.service_name}
                            </option>
                        ))}
                    </select>
                    {errors.service_id && (
                        <p className="text-red-500">{errors.service_id}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        required
                    ></textarea>
                    {errors.description && (
                        <p className="text-red-500">{errors.description}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Upload Photos</label>
                    <input
                        type="file"
                        multiple
                        className="w-full border p-2 rounded"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {photoPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.photos && (
                        <p className="text-red-500">{errors.photos}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Weight (kg)</label>
                    <input
                        type="number"
                        step="0.1"
                        className="w-full border p-2 rounded"
                        value={data.weight}
                        onChange={(e) => setData("weight", e.target.value)}
                        required
                    />
                    {errors.weight && (
                        <p className="text-red-500">{errors.weight}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">
                        Shipping Cost (Rp)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        className="w-full border p-2 rounded"
                        value={data.shipping_cost}
                        onChange={(e) =>
                            setData("shipping_cost", e.target.value)
                        }
                        required
                    />
                    {errors.shipping_cost && (
                        <p className="text-red-500">{errors.shipping_cost}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {processing ? "Processing..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
