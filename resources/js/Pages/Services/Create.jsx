import React from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Paintbrush, Save } from "lucide-react";
import ServiceForm from "@/Components/ServiceForm";
import AdditionalForm from "@/Components/AdditionalForm";
import AdditionalList from "@/Components/AdditionalList";

export default function CreateService({ additionalTypes: initialTypes, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        service_name: "",
        description: "",
        base_price: "",
        additionals: [],
    });

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
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-3xl font-bold text-blue-600 flex items-center animate-fade-in animate-pulse">
                    <Paintbrush
                        size={28}
                        className="mr-2 animate-bounce-subtle"
                    />
                    Tambah Layanan Baru
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
                                    additionalTypes={initialTypes}
                                />
                            </div>
                            <div>
                                <AdditionalList
                                    data={data}
                                    additionalTypes={initialTypes}
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
                                        : "Simpan Layanan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
