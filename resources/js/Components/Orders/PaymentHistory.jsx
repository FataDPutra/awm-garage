import React from "react";

export default function PaymentHistory({ payments }) {
    return (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg transform transition-all hover:shadow-xl">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 border-b pb-2 border-purple-200">
                Riwayat Pembayaran
            </h3>
            {payments.length > 0 ? (
                <div className="space-y-6">
                    {payments.map((payment, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-sm"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <p className="text-gray-700 text-lg">
                                    <strong className="font-semibold text-gray-800">
                                        Jumlah:
                                    </strong>{" "}
                                    <span className="text-purple-600 font-medium">
                                        Rp {payment.amount.toLocaleString()}
                                    </span>
                                </p>
                                <p className="text-gray-700 text-lg">
                                    <strong className="font-semibold text-gray-800">
                                        Status:
                                    </strong>{" "}
                                    <span
                                        className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold ${
                                            payment.payment_status === "paid"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        } shadow-sm`}
                                    >
                                        {payment.payment_status === "paid"
                                            ? "Lunas"
                                            : "Menunggu"}
                                    </span>
                                </p>
                                <p className="text-gray-700 text-lg">
                                    <strong className="font-semibold text-gray-800">
                                        Metode:
                                    </strong>{" "}
                                    {payment.payment_method || "N/A"}
                                </p>
                                <p className="text-gray-700 text-lg">
                                    <strong className="font-semibold text-gray-800">
                                        Waktu:
                                    </strong>{" "}
                                    {payment.payment_time
                                        ? new Date(
                                              payment.payment_time
                                          ).toLocaleString("id-ID")
                                        : "Belum Dibayar"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 italic text-lg">
                    Belum ada riwayat pembayaran untuk pesanan ini.
                </p>
            )}
        </div>
    );
}
