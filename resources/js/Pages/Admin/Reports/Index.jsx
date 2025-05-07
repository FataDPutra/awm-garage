import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import OrderTable from "@/Components/Admin/Reports/OrderTable";
import OrderList from "@/Components/Admin/Reports/OrderList";
import { BarChart2, Download } from "lucide-react";

export default function Index({ auth }) {
    const { orders, filter_type, start_date, end_date, month, year } =
        usePage().props;
    const [filterType, setFilterType] = useState(filter_type || "date");
    const [startDate, setStartDate] = useState(start_date || "");
    const [endDate, setEndDate] = useState(end_date || "");
    const [selectedMonth, setSelectedMonth] = useState(month || "");
    const [selectedYear, setSelectedYear] = useState(year || "");
    const [error, setError] = useState("");

    const handleFilter = () => {
        setError("");
        let query = { filter_type: filterType };

        if (filterType === "date") {
            if (!startDate || !endDate) {
                setError("Harap masukkan tanggal awal dan akhir.");
                return;
            }
            if (new Date(startDate) > new Date(endDate)) {
                setError(
                    "Tanggal awal tidak boleh lebih besar dari tanggal akhir."
                );
                return;
            }
            query.start_date = startDate;
            query.end_date = endDate;
        } else if (filterType === "month") {
            if (!selectedMonth || !selectedYear) {
                setError("Harap pilih bulan dan tahun.");
                return;
            }
            query.month = selectedMonth;
            query.year = selectedYear;
        } else if (filterType === "year") {
            if (!selectedYear) {
                setError("Harap masukkan tahun.");
                return;
            }
            query.year = selectedYear;
        }

        window.location.href = route("reports.index", query);
    };

    const handleExportPDF = () => {
        let query = { filter_type: filterType };

        if (filterType === "date") {
            if (!startDate || !endDate) {
                setError(
                    "Harap masukkan tanggal awal dan akhir sebelum ekspor."
                );
                return;
            }
            if (new Date(startDate) > new Date(endDate)) {
                setError(
                    "Tanggal awal tidak boleh lebih besar dari tanggal akhir."
                );
                return;
            }
            query.start_date = startDate;
            query.end_date = endDate;
        } else if (filterType === "month") {
            if (!selectedMonth || !selectedYear) {
                setError("Harap pilih bulan dan tahun sebelum ekspor.");
                return;
            }
            query.month = selectedMonth;
            query.year = selectedYear;
        } else if (filterType === "year") {
            if (!selectedYear) {
                setError("Harap masukkan tahun sebelum ekspor.");
                return;
            }
            query.year = selectedYear;
        }

        window.location.href = route("reports.export-pdf", query);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center gap-3">
                    <BarChart2 size={28} className="text-blue-500" />
                    <h2 className="text-2xl font-bold text-blue-600">
                        Laporan Pesanan
                    </h2>
                </div>
            }
            preferredActiveMenu="/admin/reports"
        >
            <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Laporan Semua Pesanan
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            Lihat laporan pesanan berdasarkan rentang waktu.
                        </p>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 min-h-[44px] sm:w-auto w-full"
                    >
                        <Download size={18} />
                        Export to PDF
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Filter Laporan
                    </h3>
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipe Filter
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            >
                                <option value="date">Tanggal</option>
                                <option value="month">Bulan</option>
                                <option value="year">Tahun</option>
                            </select>
                        </div>
                        {filterType === "date" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Awal
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal Akhir
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </>
                        )}
                        {filterType === "month" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bulan
                                    </label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) =>
                                            setSelectedMonth(e.target.value)
                                        }
                                        className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    >
                                        <option value="">Pilih Bulan</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString(
                                                    "id-ID",
                                                    { month: "long" }
                                                )}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tahun
                                    </label>
                                    <input
                                        type="number"
                                        value={selectedYear}
                                        onChange={(e) =>
                                            setSelectedYear(e.target.value)
                                        }
                                        placeholder="Tahun"
                                        className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </>
                        )}
                        {filterType === "year" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tahun
                                </label>
                                <input
                                    type="number"
                                    value={selectedYear}
                                    onChange={(e) =>
                                        setSelectedYear(e.target.value)
                                    }
                                    placeholder="Tahun"
                                    className="w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        )}
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 min-h-[44px] text-sm"
                            >
                                Terapkan Filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
                    <div className="hidden sm:block">
                        <OrderTable orders={orders} />
                    </div>
                    <div className="block sm:hidden">
                        <OrderList orders={orders} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
