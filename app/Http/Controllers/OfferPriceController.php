<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\OfferPrice;
use Illuminate\Support\Facades\Http;


class OfferPriceController extends Controller
{
    private function sendStatusNotification($purchaseRequest, $statusMessage)
    {
        $user = $purchaseRequest->user;

        // Hanya kirim notifikasi jika nomor telepon sudah diverifikasi
        if (!$user->phone_verified_at) {
            \Log::info('Notifikasi tidak dikirim karena nomor belum diverifikasi', ['user_id' => $user->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo {$user->full_name}, permintaan pembelian Anda (ID: {$purchaseRequest->id}) telah diperbarui: {$statusMessage} Silahkan pantau pesanan anda secara berkala melalui website https://awmgarage.store";
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
    public function storeOfferPrice(Request $request, $id)
    {
        $request->validate([
            'service_price' => 'required|numeric|min:0',
            'dp_amount' => 'required|numeric|min:0',
            'estimation_days' => 'required|integer|min:1',
            'shipping_cost_to_customer' => 'required|numeric|min:0',
            'shipping_to_customer_selection' => 'required|array',
            'total_price' => 'required|numeric|min:0',
        ]);

        $purchaseRequest = PurchaseRequest::findOrFail($id);

        OfferPrice::create([
            'pr_id' => $id,
            'service_price' => $request->service_price,
            'dp_amount' => $request->dp_amount,
            'estimation_days' => $request->estimation_days,
            'shipping_cost_to_customer' => $request->shipping_cost_to_customer,
            'shipping_to_customer_details' => $request->shipping_to_customer_selection,
            'total_price' => $request->total_price,
            'status' => 'pending'
        ]);

        $purchaseRequest->update(['status' => 'offer_sent']);

        $this->sendStatusNotification($purchaseRequest, "Penawaran harga telah diberikan Admin untuk pesanan Anda. Mohon segera tentukan pesanan anda agar segera diproses.");

        return redirect()->route('admin.purchaserequests.show', $id)->with('success', 'Offer Price sent successfully.');
    }


    public function updateOfferPrice(Request $request, $id)
    {
        $request->validate([
            'service_price' => 'required|numeric|min:0',
            'dp_amount' => 'required|numeric|min:0',
            'estimation_days' => 'required|integer|min:1',
            'shipping_cost_to_customer' => 'required|numeric|min:0',
            'shipping_to_customer_selection' => 'required|array',
            'total_price' => 'required|numeric|min:0',
        ]);

        $purchaseRequest = PurchaseRequest::with('offerPrice')
            ->where('id', $id)
            ->whereHas('offerPrice', function ($query) {
                $query->where('status', 'pending');
            })
            ->firstOrFail();

        $purchaseRequest->offerPrice->update([
            'service_price' => $request->service_price,
            'dp_amount' => $request->dp_amount,
            'estimation_days' => $request->estimation_days,
            'shipping_cost_to_customer' => $request->shipping_cost_to_customer,
            'shipping_to_customer_details' => $request->shipping_to_customer_selection,
            'total_price' => $request->total_price,
        ]);

        $this->sendStatusNotification($purchaseRequest, "Penawaran harga terbaru telah diberikan Admin untuk pesanan Anda. Mohon segera tentukan pesanan anda agar segera diproses.");

        return redirect()->route('admin.purchaserequests.show', $id)
            ->with('success', 'Offer Price updated successfully.');
    }
}
