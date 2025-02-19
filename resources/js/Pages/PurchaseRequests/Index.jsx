import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Index() {
    const { purchaseRequests } = usePage().props; // Ambil data dari controller

    return (
        <div className="container mx-auto p-6">
            <Head title="Purchase Requests" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Purchase Requests</h1>
                <Link
                    href={route("purchase-requests.create")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create Request
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 border">No</th>
                            <th className="p-3 border">Request ID</th>
                            <th className="p-3 border">Service</th>
                            <th className="p-3 border">Description</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseRequests.length > 0 ? (
                            purchaseRequests.map((request, index) => (
                                <tr
                                    key={request.id}
                                    className="border-b hover:bg-gray-100"
                                >
                                    <td className="p-3 border">{index + 1}</td>
                                    <td className="p-3 border">{request.id}</td>
                                    <td className="p-3 border">
                                        {request.service?.service_name}
                                    </td>
                                    <td className="p-3 border">
                                        {request.description}
                                    </td>

                                    <td className="p-3 border">
                                        <span
                                            className={`px-2 py-1 rounded text-white ${
                                                request.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : request.status ===
                                                      "approved"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="p-3 border">
                                        <Link
                                            href={route(
                                                "purchase_requests.show",
                                                request.id
                                            )}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-3 text-center">
                                    No Purchase Requests Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
