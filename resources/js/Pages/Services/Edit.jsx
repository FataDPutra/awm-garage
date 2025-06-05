import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Paintbrush, Save } from "lucide-react";
import ServiceForm from "@/Components/ServiceForm";
import AdditionalForm from "@/Components/AdditionalForm";
import AdditionalList from "@/Components/AdditionalList";

export default function Edit({ service, additionalTypes: initialTypes, auth }) {
    const [additionalTypes, setAdditionalTypes] = useState(initialTypes);
    const { data, setData, post, processing, errors } = useForm({
        service_name: service.service_name || "",
        description: service.description || "",
        base_price: service.base_price || 0,
        additionals: service.additionals.map((add) => ({
            id: add.id || null,
            additional_type_id: add.additional_type_id
                ? parseInt(add.additional_type_id, 10)
                : null,
            name: add.name || "",
            image_path: add.image_path || null,
            image: null,
            preview: add.image_path ? `/storage/${add.image_path}` : null,
            additional_price: add.additional_price || 0,
        })),
    });

    const handleAddType = (newType) => {
        setAdditionalTypes([...additionalTypes, newType]);
        console.log("New type added to Edit:", newType);
        console.log("Updated additionalTypes:", additionalTypes);
    };

    const handleRemoveAdditional = (index) => {
        const updatedAdditionals = data.additionals.filter(
            (_, i) => i !== index
        );
        setData("additionals", updatedAdditionals);
        console.log("Additional removed at index:", index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.service_name || !data.base_price) {
            alert("Service name dan base price harus diisi!");
            return;
        }

        const formData = new FormData();
        formData.append("service_name", data.service_name);
        formData.append("description", data.description || "");
        formData.append("base_price", data.base_price.toString());
        formData.append("_method", "PUT");

        data.additionals.forEach((add, index) => {
            formData.append(`additionals[${index}][id]`, add.id || "");
            formData.append(
                `additionals[${index}][additional_type_id]`,
                add.additional_type_id !== null
                    ? add.additional_type_id.toString()
                    : ""
            );
            formData.append(`additionals[${index}][name]`, add.name || "");
            if (add.image instanceof File) {
                formData.append(`additionals[${index}][image]`, add.image);
                console.log(`Appending image ${index}:`, {
                    name: add.image.name,
                    size: add.image.size,
                    type: add.image.type,
                });
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

        post(route("services.update", service.id), {
            data: formData,
            forceFormData: true, // Selalu gunakan FormData untuk konsistensi
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => alert("Service berhasil diperbarui!"),
            onError: (errors) =>
                alert("Gagal memperbarui service: " + JSON.stringify(errors)),
        });
    };

    console.log("Rendering Edit with data:", {
        service_name: data.service_name,
        base_price: data.base_price,
        additionals: data.additionals,
        additionalTypes,
    });

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-3xl font-bold text-blue-600 flex items-center animate-fade-in animate-pulse">
                    <Paintbrush
                        size={28}
                        className="mr-2 animate-bounce-subtle"
                    />
                    Edit Layanan
                </h2>
            }
        >
            <div className="min-h-screen bg-blue-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl animate-fade-in">
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-8"
                        >
                            <div className="border-b border-blue-100 pb-4">
                                <ServiceForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            </div>
                            <div className="border-b border-blue-100 pb-4">
                                <AdditionalForm
                                    data={data}
                                    setData={setData}
                                    additionalTypes={additionalTypes}
                                    onAddType={handleAddType}
                                />
                            </div>
                            <div>
                                <AdditionalList
                                    data={data}
                                    additionalTypes={additionalTypes}
                                    onRemove={handleRemoveAdditional}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto group overflow-hidden"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                    <Save size={20} />{" "}
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
