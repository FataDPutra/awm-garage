import React from "react";

export default function PaymentStatus({ payments }) {
    const latestPayment = payments[payments.length - 1] || {};

    return (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 border-b pb-2 border-purple-200">
                Status Pembayaran
            </h3>
            <div className="space-y-4">
                {payments.length > 0 ? (
                    <>
                        <p className="text-gray-700 text-lg">
                            <strong className="font-semibold text-gray-800">
                                Status Terakhir:
                            </strong>{" "}
                            <span
                                className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold ${
                                    latestPayment.payment_status === "paid"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                } shadow-sm`}
                            >
                                {latestPayment.payment_status === "paid"
                                    ? "Lunas"
                                    : "Menunggu Pembayaran"}
                            </span>
                        </p>
                        <p className="text-gray-700 text-lg">
                            <strong className="font-semibold text-gray-800">
                                Jumlah:
                            </strong>{" "}
                            <span className="text-purple-600 font-medium">
                                Rp{" "}
                                {latestPayment.amount?.toLocaleString() ||
                                    "N/A"}
                            </span>
                        </p>
                        <p className="text-gray-700 text-lg">
                            <strong className="font-semibold text-gray-800">
                                Tanggal:
                            </strong>{" "}
                            {latestPayment.created_at
                                ? new Date(
                                      latestPayment.created_at
                                  ).toLocaleDateString("id-ID")
                                : "Belum Dibayar"}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-600 italic">
                        Belum ada data pembayaran untuk pesanan ini.
                    </p>
                )}
            </div>
        </div>
    );
}
