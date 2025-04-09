// resources/js/Components/Admin/OfferForm.jsx
import React from "react";
import { DollarSign, Loader2, Send, X } from "lucide-react";

const OfferForm = ({
    purchaseRequest,
    data,
    setData,
    errors,
    processing,
    isEditingOffer,
    shippingOptionsToCustomer,
    isCalculatingShipping,
    shippingError,
    handleShippingOptionChange,
    handleSubmit,
    setIsEditingOffer,
    getTotalEstimatedDays,
    formatCurrency,
}) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200 transform transition-all duration-300 hover:shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <DollarSign size={24} className="mr-2 text-blue-600" />
                {isEditingOffer ? "Edit Penawaran" : "Buat Penawaran"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grup Harga Layanan */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Harga Layanan (Rp)
                    </label>
                    <input
                        type="number"
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        value={data.service_price}
                        onChange={(e) =>
                            setData("service_price", e.target.value)
                        }
                        required
                        min="0"
                        placeholder="Masukkan harga layanan"
                    />
                    {errors.service_price && (
                        <p className="text-red-500 text-xs mt-1 italic">
                            {errors.service_price}
                        </p>
                    )}
                </div>

                {/* Grup DP */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Jumlah DP (Rp) - 50% dari Harga Layanan
                    </label>
                    <input
                        type="number"
                        className="w-full border-2 border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 italic cursor-not-allowed"
                        value={data.dp_amount}
                        readOnly
                        placeholder="Otomatis dihitung"
                    />
                </div>

                {/* Grup Estimasi Hari */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Estimasi Hari
                    </label>
                    <input
                        type="number"
                        className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        value={data.estimation_days}
                        onChange={(e) =>
                            setData("estimation_days", e.target.value)
                        }
                        required
                        min="1"
                        placeholder="Masukkan estimasi hari"
                    />
                    {data.estimation_days &&
                        data.shipping_to_customer_selection?.etd && (
                            <p className="text-blue-600 text-xs mt-1 font-medium">
                                Total Estimasi + Pengiriman:{" "}
                                <span className="font-bold">
                                    {getTotalEstimatedDays(
                                        data.estimation_days,
                                        data.shipping_to_customer_selection.etd
                                    )}
                                </span>
                            </p>
                        )}
                    {errors.estimation_days && (
                        <p className="text-red-500 text-xs mt-1 italic">
                            {errors.estimation_days}
                        </p>
                    )}
                </div>

                {/* Grup Opsi Pengiriman */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Opsi Pengiriman ke Pelanggan
                    </label>
                    <div className="relative">
                        <select
                            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                            value={
                                data.shipping_to_customer_selection
                                    ? `${data.shipping_to_customer_selection.code}|${data.shipping_to_customer_selection.service}`
                                    : ""
                            }
                            onChange={handleShippingOptionChange}
                            required
                            disabled={
                                isCalculatingShipping ||
                                shippingOptionsToCustomer.length === 0
                            }
                        >
                            <option value="">Pilih opsi pengiriman</option>
                            {shippingOptionsToCustomer.map((option) => (
                                <option
                                    key={`${option.code}|${option.service}`}
                                    value={`${option.code}|${option.service}`}
                                >
                                    {option.name} - {option.service} (
                                    {formatCurrency(option.cost)}, ETD:{" "}
                                    {option.etd || "N/A"})
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                    {isCalculatingShipping && (
                        <p className="text-blue-600 text-xs mt-1 flex items-center">
                            <Loader2 size={16} className="animate-spin mr-1" />
                            Menghitung opsi pengiriman...
                        </p>
                    )}
                    {shippingError && (
                        <p className="text-red-500 text-xs mt-1 italic">
                            {shippingError}
                        </p>
                    )}
                    {shippingOptionsToCustomer.length === 0 &&
                        !isCalculatingShipping &&
                        !shippingError && (
                            <p className="text-red-500 text-xs mt-1 italic">
                                Tidak ada opsi pengiriman tersedia.
                            </p>
                        )}
                </div>

                {/* Grup Biaya Pengiriman */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Biaya Pengiriman ke Pelanggan (Rp)
                    </label>
                    <input
                        type="number"
                        className="w-full border-2 border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 italic cursor-not-allowed"
                        value={data.shipping_cost_to_customer}
                        readOnly
                        placeholder="Otomatis dari opsi pengiriman"
                    />
                </div>

                {/* Grup Total Harga */}
                <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Total Harga (Rp)
                    </label>
                    <input
                        type="number"
                        className="w-full border-2 border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 font-bold text-lg cursor-not-allowed"
                        value={data.total_price}
                        readOnly
                        placeholder="Otomatis dihitung"
                    />
                    {errors.total_price && (
                        <p className="text-red-500 text-xs mt-1 italic">
                            {errors.total_price}
                        </p>
                    )}
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={processing || isCalculatingShipping}
                        className="relative bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center w-full sm:w-auto disabled:bg-blue-400 disabled:cursor-not-allowed group"
                    >
                        {processing ? (
                            <Loader2 size={20} className="animate-spin mr-2" />
                        ) : (
                            <Send
                                size={20}
                                className="mr-2 group-hover:scale-110 transition-transform duration-200"
                            />
                        )}
                        {processing
                            ? "Memproses..."
                            : isEditingOffer
                            ? "Perbarui Penawaran"
                            : "Kirim Penawaran"}
                    </button>
                    {isEditingOffer && (
                        <button
                            type="button"
                            onClick={() => setIsEditingOffer(false)}
                            className="relative bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center w-full sm:w-auto group"
                        >
                            <X
                                size={20}
                                className="mr-2 group-hover:scale-110 transition-transform duration-200"
                            />
                            Batal
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default OfferForm;
