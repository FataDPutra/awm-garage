<?php

namespace App\Http\Controllers;

use App\Models\OfferPrice;
use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OfferPriceController extends Controller
{
    // Menampilkan daftar Purchase Request yang belum diberi harga (untuk admin)
    public function index()
    {
        $offerPrices = OfferPrice::with('purchaseRequest.service', 'purchaseRequest.user')->get();

        return Inertia::render('OfferPrices/Index', [
            'offerPrices' => $offerPrices
        ]);
    }

    // Form untuk admin memberikan harga pada Purchase Request
    public function create($pr_id)
    {
        $purchaseRequest = PurchaseRequest::findOrFail($pr_id);

        return Inertia::render('OfferPrices/Create', [
            'purchaseRequest' => $purchaseRequest
        ]);
    }

    // Menyimpan penawaran harga yang diberikan admin
    public function store(Request $request)
    {
        $request->validate([
            'pr_id' => 'required|exists:purchase_requests,id',
            'service_price' => 'required|numeric|min:0',
            'dp_amount' => 'required|numeric|min:0',
            'estimation_days' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0'
        ]);

        $offerPrice = OfferPrice::create([
            'pr_id' => $request->pr_id,
            'service_price' => $request->service_price,
            'dp_amount' => $request->dp_amount,
            'estimation_days' => $request->estimation_days,
            'total_price' => $request->total_price,
            'status' => 'pending'
        ]);

        // Update status Purchase Request ke "offer_sent"
        PurchaseRequest::where('id', $request->pr_id)->update(['status' => 'offer_sent']);

        return redirect()->route('offer-prices.index')->with('success', 'Penawaran harga berhasil dibuat.');
    }

    // Menampilkan detail Offer Price untuk kustomer
    public function show($id)
    {
        $offerPrice = OfferPrice::with('purchaseRequest.service', 'purchaseRequest.user')->findOrFail($id);

        return Inertia::render('OfferPrices/Show', [
            'offerPrice' => $offerPrice
        ]);
    }

    // Kustomer menekan tombol "Setuju" dan membayar DP
    public function acceptOffer($id)
    {
        $offerPrice = OfferPrice::findOrFail($id);

        // Update status Offer Price ke "accepted"
        $offerPrice->update(['status' => 'accepted']);

        // Update status Purchase Request ke "waiting_for_dp"
        $offerPrice->purchaseRequest->update(['status' => 'waiting_for_dp']);

        return redirect()->route('purchase-requests.index')->with('success', 'Penawaran diterima. Silakan lakukan DP.');
    }

    // Kustomer menolak penawaran
    public function rejectOffer($id)
    {
        $offerPrice = OfferPrice::findOrFail($id);

        // Update status Offer Price ke "rejected"
        $offerPrice->update(['status' => 'rejected']);

        // Update status Purchase Request ke "cancelled"
        $offerPrice->purchaseRequest->update(['status' => 'cancelled']);

        return redirect()->route('purchase-requests.index')->with('error', 'Penawaran ditolak.');
    }
}
