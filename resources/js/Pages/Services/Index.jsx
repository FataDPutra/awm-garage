import React from "react";
import { Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Paintbrush, PlusCircle } from "lucide-react";
import ServiceList from "@/Components/ServiceList";

export default function Index({ services, auth }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this service?")) {
            Inertia.delete(route("services.destroy", id), {
                onSuccess: () => console.log("Service deleted successfully"),
                onError: (errors) =>
                    alert(
                        "Failed to delete service: " + JSON.stringify(errors)
                    ),
            });
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in animate-pulse">
                    <h2 className="text-3xl font-bold text-blue-600 flex items-center">
                        <Paintbrush
                            size={28}
                            className="mr-2 animate-bounce-subtle"
                        />
                        Daftar Layanan
                    </h2>

                    <Link
                        href={route("services.create")}
                        className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 group overflow-hidden"
                    >
                        <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                        <PlusCircle size={20} /> Tambah Layanan
                    </Link>
                </div>
            }
        >
            <div className="min-h-screen bg-blue-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="animate-fade-in">
                        <ServiceList
                            services={services}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
