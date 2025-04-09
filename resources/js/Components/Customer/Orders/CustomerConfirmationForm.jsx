export default function CustomerConfirmationForm({
    order,
    data,
    setData,
    post,
    processing,
}) {
    if (
        !order.completed_photo_path ||
        order.customer_confirmation !== "pending"
    )
        return null;

    const handleConfirm = (e) => {
        e.preventDefault();
        post(`/orders/${order.order_id}/confirm`, {
            preserveScroll: true,
            onSuccess: () => alert("Konfirmasi orderan berhasil!"),
        });
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Konfirmasi Hasil Pengerjaan
            </h3>
            <form onSubmit={handleConfirm} className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="customer_confirmation"
                                value="approved"
                                checked={
                                    data.customer_confirmation === "approved"
                                }
                                onChange={(e) =>
                                    setData(
                                        "customer_confirmation",
                                        e.target.value
                                    )
                                }
                                className="form-radio h-5 w-5 text-blue-600"
                                required
                            />
                            <span className="ml-2">Saya Setuju</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="customer_confirmation"
                                value="rejected"
                                checked={
                                    data.customer_confirmation === "rejected"
                                }
                                onChange={(e) =>
                                    setData(
                                        "customer_confirmation",
                                        e.target.value
                                    )
                                }
                                className="form-radio h-5 w-5 text-blue-600"
                                required
                            />
                            <span className="ml-2">Saya Tidak Setuju</span>
                        </label>
                    </div>
                    {data.customer_confirmation === "rejected" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alasan:
                            </label>
                            <textarea
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={data.customer_feedback}
                                onChange={(e) =>
                                    setData("customer_feedback", e.target.value)
                                }
                                rows={3}
                                required
                            />
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md"
                    disabled={processing}
                >
                    {processing ? "Mengirim..." : "Kirim Konfirmasi"}
                </button>
            </form>
        </section>
    );
}
