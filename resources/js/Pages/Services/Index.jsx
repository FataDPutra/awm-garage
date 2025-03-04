import { Inertia } from "@inertiajs/inertia";
import { Link, router } from "@inertiajs/react";

export default function Index({ services }) {
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this service?")) {
            Inertia.delete(route("services.destroy", id), {
                onSuccess: () => {
                    console.log("Service deleted successfully");
                },
                onError: (errors) => {
                    console.log("Errors:", errors);
                    alert(
                        "Failed to delete service: " + JSON.stringify(errors)
                    );
                },
            });
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Daftar Layanan</h2>
            <Link
                href={route("services.create")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Tambah Layanan
            </Link>

            <table className="w-full mt-4 border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Nama Layanan</th>
                        <th className="border p-2">Deskripsi</th>
                        <th className="border p-2">Harga</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service.id} className="border">
                            <td className="p-2">{service.service_name}</td>
                            <td className="p-2">{service.description}</td>
                            <td className="p-2">Rp {service.base_price}</td>
                            <td className="p-2">
                                <Link
                                    href={route("services.edit", service.id)}
                                    className="text-blue-500 mx-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="text-red-500"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
