import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Paintbrush } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CustomerServices({ services }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
                    <h2 className="text-3xl font-bold text-blue-600 flex items-center">
                        <Paintbrush
                            size={28}
                            className="mr-2 animate-bounce-subtle"
                        />
                        Layanan Kami
                    </h2>
                </div>
            }
        >
            <div className="min-h-screen bg-blue-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="animate-fade-in">
                        {services.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                {service.service_name}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {service.description ||
                                                    "Tidak ada deskripsi tersedia."}
                                            </p>
                                            <p className="text-gray-800 font-semibold mb-4">
                                                Rp{" "}
                                                {service.base_price.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>
                                            <Link
                                                href={route(
                                                    "customer.services.show",
                                                    service.id
                                                )}
                                                className="block text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                Belum ada layanan tersedia saat ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
