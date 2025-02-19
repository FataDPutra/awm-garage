<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\OfferPrice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    // 📌 Form untuk melakukan DP
    public function createDP($offerprice_id)
    {
        $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($offerprice_id);

        return Inertia::render('Payments/CreateDP', [
            'offerPrice' => $offerPrice,
            'purchaseRequest' => $offerPrice->purchaseRequest
        ]);
    }

    // 📌 Menyimpan pembayaran DP
    public function storeDP(Request $request)
    {
        $request->validate([
            'offerprice_id' => 'required|exists:offer_prices,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string'
        ]);

        $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($request->offerprice_id);

        // 🔹 Simulasi API Payment Gateway
        $transaction_id = 'TXN-' . strtoupper(uniqid());

        $payment = Payment::create([
            'offerprice_id' => $offerPrice->id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'payment_type' => 'dp',
            'transaction_id' => $transaction_id,
            'payment_status' => 'success',
            'payment_time' => now()
        ]);

        // 🔹 Update status Offer Price dan Purchase Request
        $offerPrice->update(['status' => 'accepted']);
        $offerPrice->purchaseRequest->update(['status' => 'processing']);

        // 🔹 Buat Order setelah DP berhasil
        Order::create([
            'order_id' => 'INV-' . now()->format('Ymd') . '-' . str_pad($offerPrice->id, 4, '0', STR_PAD_LEFT),
            'offerprice_id' => $offerPrice->id,
            'status' => 'waiting_for_customer_shipment'
        ]);

        return redirect()->route('purchase_requests.index')->with('success', 'DP berhasil dibayar, silakan kirim barang.');
    }

    // 📌 Form untuk pembayaran sisa
    public function createFull($offerprice_id)
    {
        $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($offerprice_id);

        return Inertia::render('Payments/CreateFull', [
            'offerPrice' => $offerPrice,
            'purchaseRequest' => $offerPrice->purchaseRequest
        ]);
    }


    // 📌 Menyimpan pembayaran penuh
public function storeFull(Request $request)
{
    $request->validate([
        'offerprice_id' => 'required|exists:offer_prices,id',
        'amount' => 'required|numeric|min:0',
        'payment_method' => 'required|string'
    ]);

    $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($request->offerprice_id);

    // 🔹 Simulasi API Payment Gateway
    $transaction_id = 'TXN-' . strtoupper(uniqid());

    $payment = Payment::create([
        'offerprice_id' => $offerPrice->id,
        'amount' => $request->amount,
        'payment_method' => $request->payment_method,
        'payment_type' => 'full',
        'transaction_id' => $transaction_id,
        'payment_status' => 'paid',
        'payment_time' => now()
    ]);

    // 🔹 Check if Order exists, create new one if not
    $order = Order::where('offerprice_id', $offerPrice->id)->first();

    if ($order) {
        // If the order exists, update the status
        $order->update(['status' => 'waiting_for_shipment']);
    } else {
        // If the order does not exist, create a new one
        Order::create([
            'order_id' => 'INV-' . now()->format('Ymd') . '-' . str_pad($offerPrice->id, 4, '0', STR_PAD_LEFT),
            'offerprice_id' => $offerPrice->id,
            'status' => 'waiting_for_customer_shipment'
        ]);
    }
        $offerPrice->update(['status' => 'accepted']);
        $offerPrice->purchaseRequest->update(['status' => 'processing']);

    return redirect()->route('purchase_requests.index')->with('success', 'Pembayaran penuh berhasil, barang akan dikirim.');
}

}
