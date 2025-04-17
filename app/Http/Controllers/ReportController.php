<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use PDF;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $filterType = $request->query('filter_type', 'date');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $month = $request->query('month');
        $year = $request->query('year');

        $query = Order::with([
            'offerPrice.purchaseRequest.service',
            'offerPrice.purchaseRequest.user'
        ])
        ->whereHas('offerPrice.purchaseRequest.user')
        ->whereHas('offerPrice.purchaseRequest.service')
        ->orderBy('created_at', 'desc');

        // Filter berdasarkan tipe
        if ($filterType === 'date' && $startDate && $endDate) {
            $query->whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
        } elseif ($filterType === 'month' && $month && $year) {
            $query->whereYear('created_at', $year)
                  ->whereMonth('created_at', $month);
        } elseif ($filterType === 'year' && $year) {
            $query->whereYear('created_at', $year);
        }

        $orders = $query->get();

        return Inertia::render('Admin/Reports/Index', [
            'orders' => $orders,
            'filter_type' => $filterType,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'month' => $month,
            'year' => $year,
        ]);
    }

    public function exportPDF(Request $request)
    {
        $filterType = $request->query('filter_type', 'date');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $month = $request->query('month');
        $year = $request->query('year');

        $query = Order::with([
            'offerPrice.purchaseRequest.service',
            'offerPrice.purchaseRequest.user'
        ])
        ->whereHas('offerPrice.purchaseRequest.user')
        ->whereHas('offerPrice.purchaseRequest.service')
        ->orderBy('created_at', 'desc');

        // Filter berdasarkan tipe
        if ($filterType === 'date' && $startDate && $endDate) {
            $query->whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
        } elseif ($filterType === 'month' && $month && $year) {
            $query->whereYear('created_at', $year)
                  ->whereMonth('created_at', $month);
        } elseif ($filterType === 'year' && $year) {
            $query->whereYear('created_at', $year);
        }

        $orders = $query->get();

        // Format filter untuk header PDF
        $filterDescription = '';
        if ($filterType === 'date') {
            $filterDescription = "Tanggal: " . Carbon::parse($startDate)->format('d M Y') . " - " . Carbon::parse($endDate)->format('d M Y');
        } elseif ($filterType === 'month') {
            $filterDescription = "Bulan: " . Carbon::createFromDate($year, $month, 1)->format('F Y');
        } elseif ($filterType === 'year') {
            $filterDescription = "Tahun: " . $year;
        }

        // Load view untuk PDF
        $pdf = PDF::loadView('pdf.reports', [
            'orders' => $orders,
            'filterDescription' => $filterDescription,
        ]);

        // Download file PDF
        return $pdf->download('laporan-pesanan-' . now()->format('YmdHis') . '.pdf');
    }
}