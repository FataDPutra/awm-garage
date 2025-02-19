import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Welcome, {auth.user.full_name}!
                </h1>
                <div className="mt-4">
                    {auth.user.role === "customer" ? (
                        <>
                            <Link
                                href="/purchase-requests"
                                className="btn-primary"
                            >
                                Buat Purchase Request
                            </Link>
                            <Link href="/orders" className="btn-secondary ml-4">
                                Lihat Pesanan
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/purchaserequests"
                                className="btn-primary"
                            >
                                Kelola Purchase Requests
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="btn-secondary ml-4"
                            >
                                Kelola Orders
                            </Link>
                            <Link
                                href="/services"
                                className="btn-secondary ml-4"
                            >
                                Kelola Layanan
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
