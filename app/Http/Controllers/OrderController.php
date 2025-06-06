<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OfferPrice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\OrderComplain;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    private function sendStatusNotification($order, $statusMessage)
    {
        $user = $order->offerPrice->purchaseRequest->user;

        if (!$user->phone_verified_at) {
            Log::info('Notifikasi tidak dikirim karena nomor belum diverifikasi', ['user_id' => $user->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo {$user->full_name}, pesanan Anda (ID: {$order->order_id}) telah diperbarui: {$statusMessage} Silahkan pantau pesanan anda secara berkala melalui website https://awmgarage.store";
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

    private function sendAdminStatusNotification($order, $statusMessage)
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin || !$admin->phone_verified_at) {
            Log::info('Notifikasi ke Admin tidak dikirim karena nomor belum diverifikasi atau Admin tidak ditemukan', ['admin_id' => $admin?->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo Admin, pesanan (ID: {$order->order_id}) dari {$order->offerPrice->purchaseRequest->user->full_name} telah diperbarui: {$statusMessage} Silahkan periksa di https://awmgarage.store";
        $url = 'https://console.zenziva.net/wareguler/api/sendWA/';

        $response = Http::asForm()->post($url, [
            'userkey' => $userkey,
            'passkey' => $passkey,
            'to' => $admin->phone,
            'message' => $message,
        ]);

        $result = $response->json();

        if ($result && $result['status'] != '1') {
            Log::warning('Gagal mengirim notifikasi ke Admin', [
                'admin_id' => $admin->id,
                'phone' => $admin->phone,
                'response' => $result,
            ]);
        } else {
            Log::info('Notifikasi ke Admin berhasil dikirim', [
                'admin_id' => $admin->id,
                'phone' => $admin->phone,
            ]);
        }
    }

    public function index()
    {
        $orders = Order::with('offerPrice.purchaseRequest.service', 'offerPrice.purchaseRequest.user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show($order_id)
    {
        $order = Order::with([
            'offerPrice.purchaseRequest.service.additionals',
            'offerPrice.purchaseRequest.user',
            'offerPrice.payments',
            'complains',
            'shipping',
            'reviews'
        ])
        ->where('order_id', $order_id)
        ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }

    public function confirmReceived($order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        $order->update([
            'status' => 'processing'
        ]);

        $this->sendStatusNotification($order, "Barang Anda telah diterima dan sedang diproses.");
        return redirect()->route('orders.index')->with('success', 'Barang diterima dan sedang diproses.');
    }

    public function uploadCompletedPhoto(Request $request, $order_id)
    {
        Log::info('Upload Completed Photo Input:', $request->all());

        if ($request->hasFile('completed_photo')) {
            $files = $request->file('completed_photo');
            $fileDetails = collect($files)->map(function ($file) {
                return [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                ];
            })->all();
            Log::info('Uploaded completed photo details:', $fileDetails);
        } else {
            Log::info('No completed photos uploaded');
        }

        $request->validate([
            'completed_photo.*' => 'required|image|mimes:jpeg,png,jpg,gif,heic,heif|max:10240',
        ], [
            'completed_photo.*.required' => 'Foto hasil pengerjaan wajib diunggah.',
            'completed_photo.*.image' => 'File harus berupa gambar.',
            'completed_photo.*.mimes' => 'File harus berformat JPEG, PNG, JPG, GIF, HEIC, atau HEIF.',
            'completed_photo.*.max' => 'Setiap foto maksimal 10MB.',
        ]);

        $order = Order::where('order_id', $order_id)->firstOrFail();

        $existingPhotos = is_array($order->completed_photo_path) ? $order->completed_photo_path : [];

        if ($request->hasFile('completed_photo')) {
            foreach ($request->file('completed_photo') as $file) {
                $path = $file->store('completed_photos', 'public');
                $existingPhotos[] = $path;
            }

            $order->update([
                'completed_photo_path' => $existingPhotos,
                'status' => 'waiting_for_cust_confirmation',
                'customer_confirmation' => 'pending',
            ]);
        }

        $this->sendStatusNotification($order, "Hasil pengerjaan pesanan Anda telah diunggah, mohon segera periksa dan konfirmasi.");
        return redirect()->back()->with('success', 'Foto hasil pengerjaan telah diunggah.');
    }

    public function uploadRevisionPhoto(Request $request, $order_id)
    {
        Log::info('Upload Revision Photo Input:', $request->all());

        if ($request->hasFile('revised_photo')) {
            $files = $request->file('revised_photo');
            $fileDetails = collect($files)->map(function ($file) {
                return [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime' => $file->getMimeType(),
                ];
            })->all();
            Log::info('Uploaded revision photo details:', $fileDetails);
        }

        $request->validate([
            'revised_photo.*' => 'required|image|mimes:jpeg,png,jpg,gif,heic,heif|max:10240',
        ], [
            'revised_photo.*.required' => 'Foto revisi wajib diunggah.',
            'revised_photo.*.image' => 'File harus berupa gambar.',
            'revised_photo.*.mimes' => 'File harus berformat JPEG, PNG, JPG, GIF, HEIC, atau HEIF.',
            'revised_photo.*.max' => 'Setiap foto maksimal 10MB.',
        ]);

        $order = Order::where('order_id', $order_id)->firstOrFail();

        $latestComplain = $order->complains()->latest()->first();

        if (!$latestComplain) {
            $latestComplain = $order->complains()->create([
                'customer_feedback' => null,
                'revised_photo_path' => [],
            ]);
        }

        $existingPhotos = is_array($latestComplain->revised_photo_path) ? $latestComplain->revised_photo_path : [];

        if ($request->hasFile('revised_photo')) {
            foreach ($request->file('revised_photo') as $file) {
                $path = $file->store('revised_photos', 'public');
                $existingPhotos[] = $path;
            }
            $latestComplain->update([
                'revised_photo_path' => $existingPhotos,
            ]);

            $order->update([
                'status' => 'waiting_for_cust_confirmation',
                'customer_confirmation' => 'pending',
            ]);
        }

        $this->sendStatusNotification($order, "Foto revisi telah diunggah, mohon segera periksa dan konfirmasi.");
        return redirect()->back()->with('success', 'Foto revisi berhasil diunggah.');
    }

    public function indexCustomer()
    {
        $user = auth()->user();

        $orders = Order::with([
            'offerPrice.purchaseRequest.service',
            'offerPrice.purchaseRequest.user'
        ])
        ->whereHas('offerPrice.purchaseRequest', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Orders/CustomerIndex', [
            'orders' => $orders
        ]);
    }

    public function showCustomer($order_id)
    {
        $user = auth()->user();

        $order = Order::with([
            'offerPrice.purchaseRequest.service',
            'offerPrice.purchaseRequest.user',
            'complains',
            'shipping',
            'reviews'
        ])
        ->whereHas('offerPrice.purchaseRequest', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('order_id', $order_id)
        ->firstOrFail();

        return Inertia::render('Orders/CustomerShow', [
            'order' => $order,
        ]);
    }

    public function confirmShipmentCustomer(Request $request, $order_id)
    {
        Log::info('Confirm Shipment Customer Input:', $request->all());

        if ($request->hasFile('shipping_proof_customer')) {
            $file = $request->file('shipping_proof_customer');
            $fileDetails = [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
            ];
            Log::info('Uploaded shipping proof details:', $fileDetails);
        } else {
            Log::info('No shipping proof uploaded');
        }

        $request->validate([
            'shipping_receipt_customer' => 'required|string|max:255',
            'shipping_proof_customer' => 'required|image|mimes:jpeg,png,jpg,gif,heic,heif|max:10240',
        ], [
            'shipping_receipt_customer.required' => 'Nomor resi pengiriman wajib diisi.',
            'shipping_receipt_customer.max' => 'Nomor resi maksimal 255 karakter.',
            'shipping_proof_customer.required' => 'Bukti pengiriman wajib diunggah.',
            'shipping_proof_customer.image' => 'Bukti pengiriman harus berupa gambar.',
            'shipping_proof_customer.mimes' => 'Bukti pengiriman harus berformat JPEG, PNG, JPG, GIF, HEIC, atau HEIF.',
            'shipping_proof_customer.max' => 'Bukti pengiriman maksimal 10MB.',
        ]);

        $order = Order::where('order_id', $order_id)
            ->whereHas('offerPrice.purchaseRequest', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->firstOrFail();

        if ($request->hasFile('shipping_proof_customer')) {
            $path = $request->file('shipping_proof_customer')->store('uploads', 'public');
            $order->update([
                'shipping_receipt_customer' => $request->shipping_receipt_customer,
                'shipping_proof_customer' => $path,
                'status' => 'waiting_for_admin_confirmation'
            ]);
        }

        $this->sendStatusNotification($order, "Pengiriman barang Anda telah terkonfirmasi dengan resi, menunggu verifikasi admin.");
        $this->sendAdminStatusNotification($order, "Pelanggan {$order->offerPrice->purchaseRequest->user->full_name} telah mengkonfirmasi pengiriman barang untuk pesanan (ID: {$order->order_id}).");

        return redirect()->back()->with('success', 'Pengiriman barang telah dikonfirmasi.');
    }

    public function confirmCustomerOrder(Request $request, $order_id)
    {
        $request->validate([
            'customer_confirmation' => 'required|in:approved,rejected',
            'customer_feedback' => 'nullable|string|max:500',
        ]);

        $order = Order::where('order_id', $order_id)->with('offerPrice.payments')->firstOrFail();

        $order->complains()->create([
            'customer_feedback' => $request->customer_feedback,
        ]);

        if ($request->customer_confirmation === 'approved') {
            $hasFullPayment = $order->offerPrice->payments()->where('payment_status', 'success')->exists();

            $order->update([
                'status' => $hasFullPayment ? 'waiting_for_shipment' : 'waiting_for_payment',
                'customer_confirmation' => 'approved'
            ]);

            $notificationMessage = $hasFullPayment
                ? "Anda telah menyetujui hasil pengerjaan. Pesanan Anda sedang disiapkan untuk pengiriman."
                : "Anda telah menyetujui hasil pengerjaan. Mohon segera lakukan pembayaran penuh.";
            
            $this->sendStatusNotification($order, $notificationMessage);
            $this->sendAdminStatusNotification($order, "Pelanggan {$order->offerPrice->purchaseRequest->user_id} telah menyetujui pesanan (ID: {$order->order_id}).");
        } else {
            $order->update([
                'status' => 'customer_complain',
                'customer_confirmation' => 'rejected'
            ]);

            $this->sendStatusNotification($order, "Anda telah mengkonfirmasi hasil pengerjaan dan mengajukan revisi.");
            $this->sendAdminStatusNotification($order, "Pelanggan {$order->offerPrice->purchaseRequest->user->user_id} telah mengajukan keluhan untuk pesanan (ID: {$order->order_id}).");
        }

        return redirect()->route('orders-customer.show', $order_id)->with('success', 'Konfirmasi berhasil disimpan.');
    }
}