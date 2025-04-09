import React from "react";

export default function ConfirmOrderSection({
    onSubmit,
    data,
    setData,
    errors,
}) {
    return (
        <section className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Konfirmasi Hasil Pengerjaan
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block">
                        <input
                            type="radio"
                            name="customer_confirmation"
                            value="approved"
                            checked={data.customer_confirmation === "approved"}
                            onChange={(e) =>
                                setData("customer_confirmation", e.target.value)
                            }
                            required
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Saya Setuju
                        </span>
                    </label>
                </div>
                <div>
                    <label className="block">
                        <input
                            type="radio"
                            name="customer_confirmation"
                            value="rejected"
                            checked={data.customer_confirmation === "rejected"}
                            onChange={(e) =>
                                setData("customer_confirmation", e.target.value)
                            }
                            required
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Saya Tidak Setuju
                        </span>
                    </label>
                </div>
                {data.customer_confirmation === "rejected" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Alasan:
                        </label>
                        <textarea
                            value={data.customer_feedback}
                            onChange={(e) =>
                                setData("customer_feedback", e.target.value)
                            }
                            className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-md"
                >
                    Kirim Konfirmasi
                </button>
            </form>
        </section>
    );
}
