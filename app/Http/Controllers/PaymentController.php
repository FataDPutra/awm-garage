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
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$clientKey = env('MIDTRANS_CLIENT_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = env('MIDTRANS_IS_SANITIZED', true);
        Config::$is3ds = env('MIDTRANS_IS_3DS', true);
    }

    private function sendStatusNotification($offerPrice, $statusMessage)
    {
        $user = $offerPrice->purchaseRequest->user;

        if (!$user->phone_verified_at) {
            Log::info('Notifikasi tidak dikirim karena nomor belum diverifikasi', ['user_id' => $user->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo {$user->full_name}, permintaan pemesanan Anda (ID: {$offerPrice->purchaseRequest->id}) telah diperbarui: {$statusMessage} Silahkan pantau pesanan anda secara berkala melalui website https://awmgarage.store";
        $url = 'https://console.zenziva.net/wareguler/api/sendWA/';

        $response = Http::asForm()->post($url, [
            'userkey' => $userkey,
            'passkey' => $passkey,
            'to' => $user->phone,
            'message' => $message,
        ]);

        $result = $response->json();

        if ($result && $result['status'] != '1') {
            Log::warning('Gagal mengirim notifikasi status', [
                'user_id' => $user->id,
                'phone' => $user->phone,
                'response' => $result,
            ]);
        } else {
            Log::info('Notifikasi status berhasil dikirim', [
                'user_id' => $user->id,
                'phone' => $user->phone,
            ]);
        }
    }

    public function createDP($offerprice_id)
    {
        $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($offerprice_id);
        $order = Order::where('offerprice_id', $offerprice_id)->first();

        return Inertia::render('Payments/CreateDP', [
            'offerPrice' => $offerPrice,
            'purchaseRequest' => $offerPrice->purchaseRequest,
            'midtransClientKey' => env('MIDTRANS_CLIENT_KEY'),
            'order' => $order ? ['id' => $order->id, 'status' => $order->status] : null,
            'preferredActiveMenu' => $order ? '/orders' : '/purchase-requests',
        ]);
    }

    public function storeDP(Request $request)
    {
        $request->validate([
            'offerprice_id' => 'required|exists:offer_prices,id',
            'amount' => 'required|numeric|min:0',
        ]);

        $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($request->offerprice_id);
        $user = Auth::user();

        $transactionDetails = [
            'order_id' => 'DP-' . uniqid(),
            'gross_amount' => $request->amount,
        ];

        $customerDetails = [
            'first_name' => $user->full_name,
            'email' => $user->email,
            'phone' => $user->phone,
        ];

        $payload = [
            'transaction_details' => $transactionDetails,
            'customer_details' => $customerDetails,
        ];

        try {
            $snapToken = Snap::getSnapToken($payload);

            $payment = Payment::create([
                'offerprice_id' => $offerPrice->id,
                'amount' => $request->amount,
                'payment_method' => null,
                'payment_type' => 'dp',
                'transaction_id' => $transactionDetails['order_id'],
                'payment_status' => 'pending',
                'payment_time' => null,
            ]);

            $order = Order::where('offerprice_id', $offerPrice->id)->first();

            return Inertia::render('Payments/CreateDP', [
                'offerPrice' => $offerPrice,
                'purchaseRequest' => $offerPrice->purchaseRequest,
                'midtransClientKey' => env('MIDTRANS_CLIENT_KEY'),
                'snapToken' => $snapToken,
                'order' => $order ? ['id' => $order->id, 'status' => $order->status] : null,
                'preferredActiveMenu' => '/orders', // After initiating DP payment, focus on orders
            ]);
        } catch (\Exception $e) {
            Log::error('Midtrans Error: ' . $e->getMessage());
            return back()->with('error', 'Failed to initiate payment');
        }
    }

    public function createFull($offerPriceId)
    {
        $offerPrice = OfferPrice::findOrFail($offerPriceId);
        $purchaseRequest = $offerPrice->purchaseRequest;
        $dpPayment = Payment::where('offerprice_id', $offerPriceId)
            ->where('payment_type', 'dp')
            ->first();
        $order = Order::where('offerprice_id', $offerPriceId)->first();

        return Inertia::render('Payments/CreateFull', [
            'offerPrice' => $offerPrice,
            'purchaseRequest' => $offerPrice->purchaseRequest,
            'dpPayment' => $dpPayment,
            'midtransClientKey' => env('MIDTRANS_CLIENT_KEY'),
            'order' => $order ? ['id' => $order->id, 'status' => $order->status] : null,
            'preferredActiveMenu' => $order ? '/orders' : '/purchase-requests',
        ]);
    }

    public function storeFull(Request $request)
    {
        $request->validate([
            'offerprice_id' => 'required|exists:offer_prices,id',
            'amount' => 'required|numeric|min:0',
        ]);

        $offerPrice = OfferPrice::with('purchaseRequest')->findOrFail($request->offerprice_id);
        $user = Auth::user();

        $transactionDetails = [
            'order_id' => 'FULL-' . uniqid(),
            'gross_amount' => $request->amount,
        ];

        $customerDetails = [
            'first_name' => $user->full_name,
            'email' => $user->email,
            'phone' => $user->phone,
        ];

        $payload = [
            'transaction_details' => $transactionDetails,
            'customer_details' => $customerDetails,
        ];

        try {
            $snapToken = Snap::getSnapToken($payload);

            $payment = Payment::create([
                'offerprice_id' => $offerPrice->id,
                'amount' => $request->amount,
                'payment_method' => null,
                'payment_type' => 'full',
                'transaction_id' => $transactionDetails['order_id'],
                'payment_status' => 'pending',
                'payment_time' => null,
            ]);

            $dpPayment = Payment::where('offerprice_id', $offerPrice->id)
                ->where('payment_type', 'dp')
                ->first();
            $order = Order::where('offerprice_id', $offerPrice->id)->first();

            return Inertia::render('Payments/CreateFull', [
                'offerPrice' => $offerPrice,
                'purchaseRequest' => $offerPrice->purchaseRequest,
                'dpPayment' => $dpPayment,
                'midtransClientKey' => env('MIDTRANS_CLIENT_KEY'),
                'snapToken' => $snapToken,
                'order' => $order ? ['id' => $order->id, 'status' => $order->status] : null,
                'preferredActiveMenu' => '/orders', // After initiating full payment, focus on orders
            ]);
        } catch (\Exception $e) {
            Log::error('Midtrans Error: ' . $e->getMessage());
            return back()->with('error', 'Failed to initiate payment');
        }
    }

    public function handleCallback(Request $request)
    {
        Log::info('Midtrans callback hit', [
            'url' => $request->fullUrl(),
            'payload' => $request->all(),
            'headers' => $request->headers->all(),
        ]);

        // Log semua data yang diterima dari Midtrans untuk debugging
        Log::info('Callback received from Midtrans', $request->all());

        // Tangani notifikasi tes dari Midtrans (order_id mengandung "payment_notif_test")
        if (strpos($request->order_id, 'payment_notif_test') !== false) {
            Log::info('Test notification received from Midtrans', ['order_id' => $request->order_id]);
            return response()->json(['status' => 'success'], 200);
        }

        // Ambil server key dari environment variable
        $serverKey = env('MIDTRANS_SERVER_KEY');

        // Format gross_amount agar sesuai dengan yang dikirim Midtrans (contoh: "15000.00")
        $grossAmount = number_format((float)$request->gross_amount, 2, '.', '');

        // Hitung signature_key untuk validasi
        $hashed = hash('sha512', $request->order_id . $request->status_code . $grossAmount . $serverKey);

        // Validasi signature_key
        if ($hashed !== $request->signature_key) {
            Log::warning('Invalid signature key', [
                'received_signature' => $request->signature_key,
                'calculated_signature' => $hashed,
                'order_id' => $request->order_id,
                'status_code' => $request->status_code,
                'gross_amount' => $grossAmount,
            ]);
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        // Cari data pembayaran berdasarkan transaction_id (sama dengan order_id dari Midtrans)
        $payment = Payment::where('transaction_id', $request->order_id)->first();
        if (!$payment) {
            Log::error('Payment not found for transaction_id', ['transaction_id' => $request->order_id]);
            return response()->json(['error' => 'Payment not found'], 404);
        }

        // Ambil data offerPrice dari payment
        $offerPrice = $payment->offerPrice;

        // Update payment_method jika ada
        if ($request->payment_type) {
            $payment->update(['payment_method' => $request->payment_type]);
        }

        // Proses berdasarkan transaction_status dari Midtrans
        if (in_array($request->transaction_status, ['capture', 'settlement'])) {
            Log::info('Payment successful, updating status', [
                'transaction_id' => $request->order_id,
                'payment_type' => $payment->payment_type,
            ]);

            // Update status pembayaran berdasarkan tipe pembayaran (DP atau penuh)
            $payment->update([
                'payment_status' => $payment->payment_type === 'dp' ? 'paid' : 'success',
                'payment_time' => now(),
            ]);

            // Update status offerPrice dan purchaseRequest
            $offerPrice->update(['status' => 'accepted']);
            $offerPrice->purchaseRequest->update(['status' => 'processing']);

            // Cek apakah order sudah ada sebelumnya
            $order = Order::where('offerprice_id', $offerPrice->id)->first();
            $orderExistedBefore = $order !== null;

            if ($order) {
                // Jika order sudah ada (artinya DP sudah dibayar sebelumnya)
                if ($payment->payment_type === 'dp') {
                    // Untuk pembayaran DP, status tetap waiting_for_customer_shipment
                    $order->update(['status' => 'waiting_for_customer_shipment']);
                } elseif ($payment->payment_type === 'full') {
                    // Untuk pembayaran penuh, ubah status ke waiting_for_shipment jika order sudah ada (DP sudah dibayar)
                    $order->update(['status' => 'waiting_for_shipment']);
                }
            } else {
                // Jika order belum ada (langsung bayar full tanpa DP atau ini adalah pembayaran DP pertama)
                $order = Order::create([
                    'order_id' => 'INV-' . now()->format('Ymd') . '-' . str_pad($offerPrice->id, 4, '0', STR_PAD_LEFT),
                    'offerprice_id' => $offerPrice->id,
                    'status' => 'waiting_for_customer_shipment',
                ]);
            }

            // Log status order untuk debugging
            Log::info('Order status updated', [
                'order_id' => $order->order_id,
                'status' => $order->status,
                'payment_type' => $payment->payment_type,
                'order_existed_before' => $orderExistedBefore,
            ]);

            // Kirim notifikasi ke pengguna
            if ($payment->payment_type === 'dp') {
                $message = "DP Anda telah berhasil dibayar, silakan segera kirim barang agar segera diproses.";
            } elseif ($payment->payment_type === 'full') {
                $message = $orderExistedBefore
                    ? "Pembayaran penuh Anda telah berhasil, barang akan segera dikirim."
                    : "Pembayaran penuh Anda telah berhasil, silakan segera kirim barang agar segera diproses.";
            }
            $this->sendStatusNotification($offerPrice, $message);
        } elseif (in_array($request->transaction_status, ['deny', 'cancel', 'expire'])) {
            Log::info('Payment failed, updating status to failed', ['transaction_id' => $request->order_id]);
            $payment->update(['payment_status' => 'failed']);
        } else {
            Log::info('Unhandled transaction status', [
                'transaction_id' => $request->order_id,
                'transaction_status' => $request->transaction_status,
            ]);
        }

        // Kembalikan respons sukses ke Midtrans
        return response()->json(['status' => 'success'], 200);
    }
}