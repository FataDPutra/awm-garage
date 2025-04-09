<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\OfferPrice;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Mengirim notifikasi WhatsApp berdasarkan status Payment jika nomor terverifikasi
     */
    private function sendStatusNotification($offerPrice, $statusMessage)
    {
        $user = $offerPrice->purchaseRequest->user;

        // Hanya kirim notifikasi jika nomor telepon sudah diverifikasi
        if (!$user->phone_verified_at) {
            \Log::info('Notifikasi tidak dikirim karena nomor belum diverifikasi', ['user_id' => $user->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo {$user->full_name}, permintaan pemesanan Anda (ID: {$offerPrice->purchaseRequest->id}) telah diperbarui: {$statusMessage} Silahkan pantau pesanan anda secara berkala melalui website http://awmgarage.com";
        $url = 'https://console.zenziva.net/wareguler/api/sendWA/';

        $response = Http::asForm()->post($url, [
            'userkey' => $userkey,
            'passkey' => $passkey,
            'to' => $user->phone,
            'message' => $message,
        ]);

        $result = $response->json();

        if ($result && $result['status'] != '1') {
            \Log::warning('Gagal mengirim notifikasi status', [
                'user_id' => $user->id,
                'phone' => $user->phone,
                'response' => $result,
            ]);
        } else {
            \Log::info('Notifikasi status berhasil dikirim', [
                'user_id' => $user->id,
                'phone' => $user->phone,
            ]);
        }
    }

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
        $order = Order::create([
            'order_id' => 'INV-' . now()->format('Ymd') . '-' . str_pad($offerPrice->id, 4, '0', STR_PAD_LEFT),
            'offerprice_id' => $offerPrice->id,
            'status' => 'waiting_for_customer_shipment'
        ]);

        // Kirim notifikasi jika nomor terverifikasi
        $this->sendStatusNotification($offerPrice, "DP Anda telah berhasil dibayar, silakan segera kirim barang agar segera diproses.");

        return redirect()->route('purchase_requests.index')->with('success', 'DP berhasil dibayar, silakan kirim barang.');
    }

    // 📌 Form untuk pembayaran sisa
    public function createFull($offerPriceId)
    {
        $offerPrice = OfferPrice::findOrFail($offerPriceId);
        $purchaseRequest = $offerPrice->purchaseRequest;
        $dpPayment = Payment::where('offerprice_id', $offerPriceId)
            ->where('payment_type', 'dp')
            ->first();

        return inertia('Payments/CreateFull', [
            'offerPrice' => $offerPrice,
            'purchaseRequest' => $purchaseRequest,
            'dpPayment' => $dpPayment,
        ]);
    }

    public function storeFull(Request $request)
    {
        $request->validate([
            'offerprice_id' => 'required|exists:offer_prices,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string'
        ]);

        $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($request->offerprice_id);

        $dpAmount = $offerPrice->dp_amount;

        // 🔹 Cek apakah DP sudah dibayarkan
        $dpPaid = Payment::where('offerprice_id', $offerPrice->id)
                         ->where('payment_type', 'dp')
                         ->where('payment_status', 'success')
                         ->exists();

        $remainingAmount = $dpPaid ? ($offerPrice->total_price - $dpAmount) : $offerPrice->total_price;

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
        $orderExistedBefore = $order !== null;

        if ($order) {
            // If the order exists, update the status
            $order->update(['status' => 'waiting_for_shipment']);
        } else {
            // If the order does not exist, create a new one
            $order = Order::create([
                'order_id' => 'INV-' . now()->format('Ymd') . '-' . str_pad($offerPrice->id, 4, '0', STR_PAD_LEFT),
                'offerprice_id' => $offerPrice->id,
                'status' => 'waiting_for_customer_shipment'
            ]);
        }

        $offerPrice->update(['status' => 'accepted']);
        $offerPrice->purchaseRequest->update(['status' => 'processing']);

        // Kirim notifikasi jika nomor terverifikasi
        $message = $orderExistedBefore ? "Pembayaran penuh Anda telah berhasil, barang akan dikirim." : "Pembayaran penuh Anda telah berhasil, silakan segera kirim barang agar segera diproses.";
        $this->sendStatusNotification($offerPrice, $message);

        // [CHANGED] Redirect berdasarkan apakah order sudah ada sebelumnya
        if ($orderExistedBefore) {
            return redirect()->route('orders-customer.index')->with('success', 'Pembayaran penuh berhasil, barang akan dikirim.');
        } else {
            return redirect()->route('purchase_requests.index')->with('success', 'Pembayaran penuh berhasil, silakan kirim barang.');
        }
    }
}