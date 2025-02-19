import React from "react";
import { Link } from "@inertiajs/react";

export default function Index({ purchaseRequests }) {
    return (
        <div>
            <h1>Daftar Purchase Requests</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseRequests.map((pr) => (
                        <tr key={pr.id}>
                            <td>{pr.id}</td>
                            <td>{pr.user.full_name}</td>
                            <td>{pr.service.service_name}</td>
                            <td>{pr.status}</td>
                            <td>
                                <Link
                                    href={route(
                                        "admin.purchaserequests.show",
                                        pr.id
                                    )}
                                >
                                    Show
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
