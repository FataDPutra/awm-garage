import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../Components/Layout";
import Table from "../../Components/Table";
import StatusBadge from "../../Components/StatusBadge";

export default function PurchaseRequests({ purchaseRequests }) {
    return (
        <Layout>
            <Head title="Kelola Purchase Requests" />
            <div className="p-6">
                <h1 className="text-2xl font-bold">Kelola Purchase Requests</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Kustomer</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseRequests.map((pr) => (
                            <tr key={pr.pr_id}>
                                <td>{pr.pr_id}</td>
                                <td>{pr.user.full_name}</td>
                                <td>{pr.service.service_name}</td>
                                <td>
                                    <StatusBadge status={pr.status} />
                                </td>
                                <td>
                                    <Link
                                        href={`/admin/purchase-requests/${pr.pr_id}`}
                                        className="btn-secondary"
                                    >
                                        Lihat Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Layout>
    );
}
