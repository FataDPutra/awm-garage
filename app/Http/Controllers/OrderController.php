<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OfferPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\OrderComplain;

class OrderController extends Controller
{
    private function sendStatusNotification($order, $statusMessage)
    {
        $user = $order->offerPrice->purchaseRequest->user;

        // Hanya kirim notifikasi jika nomor telepon sudah diverifikasi
        if (!$user->phone_verified_at) {
            \Log::info('Notifikasi tidak dikirim karena nomor belum diverifikasi', ['user_id' => $user->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo {$user->full_name}, pesanan Anda (ID: {$order->order_id}) telah diperbarui: {$statusMessage} Silahkan pantau pesanan anda secara berkala melalui website http://awmgarage.com";
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


    /**
     * Mengirim notifikasi WhatsApp ke Admin berdasarkan status Order
     */
    private function sendAdminStatusNotification($order, $statusMessage)
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin || !$admin->phone_verified_at) {
            \Log::info('Notifikasi ke Admin tidak dikirim karena nomor belum diverifikasi atau Admin tidak ditemukan', ['admin_id' => $admin?->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo Admin, pesanan (ID: {$order->order_id}) dari {$order->offerPrice->purchaseRequest->user->full_name} telah diperbarui: {$statusMessage} Silahkan periksa di http://awmgarage.com";
        $url = 'https://console.zenziva.net/wareguler/api/sendWA/';

        $response = Http::asForm()->post($url, [
            'userkey' => $userkey,
            'passkey' => $passkey,
            'to' => $admin->phone,
            'message' => $message,
        ]);

        $result = $response->json();

        if ($result && $result['status'] != '1') {
            \Log::warning('Gagal mengirim notifikasi ke Admin', [
                'admin_id' => $admin->id,
                'phone' => $admin->phone,
                'response' => $result,
            ]);
        } else {
            \Log::info('Notifikasi ke Admin berhasil dikirim', [
                'admin_id' => $admin->id,
                'phone' => $admin->phone,
            ]);
        }
    }

    // Menampilkan daftar pesanan berdasarkan status
    public function index()
    {
        $orders = Order::with('offerPrice.purchaseRequest.service', 'offerPrice.purchaseRequest.user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

//     public function index()
// {
//     $orders = Order::with('offerPrice.purchaseRequest.service', 'offerPrice.purchaseRequest.user')
//         ->orderBy('created_at', 'desc')
//         ->get()
//         ->groupBy('status'); // Kelompokkan berdasarkan status

//     return Inertia::render('Orders/Index', [
//         'orders' => $orders
//     ]);
// }

    // Menampilkan detail order
public function show($order_id)
{
    $order = Order::with([
        'offerPrice.purchaseRequest.service.additionals.additionalType',
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

    // Mengubah status menjadi "Barang Diterima & Diproses" oleh admin
    public function confirmReceived($order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        $order->update([
            'status' => 'processing'
        ]);

        $this->sendStatusNotification($order, "Barang Anda telah diterima dan sedang diproses.");
        return redirect()->route('orders.index')->with('success', 'Barang diterima dan sedang diproses.');
    }

    // Mengunggah hasil pengerjaan
public function uploadCompletedPhoto(Request $request, $order_id)
{
    $request->validate([
        'completed_photo.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
    ]);

    $order = Order::where('order_id', $order_id)->firstOrFail();

    // Ambil foto yang sudah ada, jika null atau kosong ubah jadi array
    $existingPhotos = json_decode($order->completed_photo_path, true) ?? [];

    if ($request->hasFile('completed_photo')) {
        foreach ($request->file('completed_photo') as $file) {
            $path = $file->store('completed_photos', 'public');
            $existingPhotos[] = $path;
        }

        // Update ke database dengan format JSON
        $order->update([
            'completed_photo_path' => $existingPhotos, // Bisa langsung array karena kolom JSON
            'status' => 'waiting_for_cust_confirmation',
            'customer_confirmation' => 'pending',
        ]);

        // $order->complains()->create([
        //     'customer_feedback' => null,
        //     'revised_photo_path' => [],
        // ]);
    }

    $this->sendStatusNotification($order, "Hasil pengerjaan pesanan anda telah diunggah, mohon segera periksa dan konfirmasi sudah sesuai dengan pesanan anda atau belum agar segera dilakukan pengiriman.");

    return redirect()->route('orders.index')->with('success', 'Foto hasil pengerjaan telah diunggah.');
}

public function uploadRevisionPhoto(Request $request, $order_id)
{
    $request->validate([
        'revised_photo.*' => 'required|image|mimes:jpeg,png,jpg|max:10240',
    ]);

    $order = Order::where('order_id', $order_id)->firstOrFail();

    // Ambil OrderComplain terbaru untuk order ini
    $latestComplain = $order->complains()->latest()->first();

    // Jika tidak ada OrderComplain sebelumnya, buat baru
    if (!$latestComplain) {
        $latestComplain = $order->complains()->create([
            // 'customer_confirmation' => 'pending',
            'customer_feedback' => null,
            'revised_photo_path' => [],
        ]);
    }

    $existingPhotos = json_decode($latestComplain->revised_photo_path, true) ?? [];

    if ($request->hasFile('revised_photo')) {
        foreach ($request->file('revised_photo') as $file) {
            $path = $file->store('revised_photos', 'public');
            $existingPhotos[] = $path;
        }
        // Update OrderComplain dengan foto revisi baru
        $latestComplain->update([
            'revised_photo_path' => $existingPhotos,
        ]);

        $order->update([
            'status' => 'waiting_for_cust_confirmation',
            'customer_confirmation' => 'pending',
        ]);
    }

    $this->sendStatusNotification($order, "Foto revisi pengerjaan pesanan anda telah diunggah, mohon segera periksa dan konfirmasi sudah sesuai dengan pesanan anda atau belum agar segera dilakukan pengiriman.");

    return back()->with('success', 'Foto revisi berhasil diunggah.');
}

// // Mengubah status menjadi "Siap Dikirim"
//     public function markAsReadyToShip($order_id)
//     {
//         $order = Order::where('order_id', $order_id)->firstOrFail();
//         $order->update([
//             'status' => 'waiting_for_shipment'
//         ]);

//         return redirect()->route('orders.index')->with('success', 'Pesanan siap untuk dikirim.');
//     }

   // ✅ Menampilkan daftar pesanan untuk customer (hanya pesanan miliknya)
public function indexCustomer()
{
    $user = auth()->user();

    $orders = Order::with([
            'offerPrice', // Memuat offerPrice langsung
            'offerPrice.purchaseRequest.service', // Memuat service
            'offerPrice.purchaseRequest.user' // Memuat user
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


// ✅ Menampilkan detail pesanan sesuai role
public function showCustomer($order_id)
{
    $user = auth()->user();

    // Mengambil order berdasarkan purchaseRequest yang dimiliki oleh user
    $order = Order::with([
            'offerPrice', 
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
        // 'flash' => [
        //     'success' => session('success'),
        //     'error' => session('error'),
        // ],
        // 'latestComplain' =>$latestComplain
    ]);
}

public function confirmShipmentCustomer(Request $request, $order_id)
{
    $request->validate([
        'shipping_receipt_customer' => 'required|string',
        'shipping_proof_customer' => 'required|image|max:2048',
    ]);

    $order = Order::where('order_id', $order_id)
        ->whereHas('offerPrice.purchaseRequest', function ($query) {
            $query->where('user_id', auth()->id());
        })
        ->firstOrFail();

    // Upload bukti pengiriman
    if ($request->hasFile('shipping_proof_customer')) {
        $path = $request->file('shipping_proof_customer')->store('shipping_proofs_customer', 'public');
        $order->update([
            'shipping_receipt_customer' => $request->shipping_receipt_customer,
            'shipping_proof_customer' => $path,
            'status' => 'waiting_for_admin_confirmation'
        ]);
    }

    $this->sendStatusNotification($order, "Pengiriman barang Anda telah dikonfirmasi, menunggu verifikasi admin ketika barang sampai.");
    $this->sendAdminStatusNotification($order, "Pelanggan {$order->offerPrice->purchaseRequest->user->full_name} telah mengirimkan barang untuk pesanan (ID: {$order->order_id}). Silahkan verifikasi.");

    return redirect()->back()->with('success', 'Pengiriman barang telah dikonfirmasi.');
}

public function confirmCustomerOrder(Request $request, $order_id)
{
    $request->validate([
        'customer_confirmation' => 'required|in:approved,rejected',
        'customer_feedback' => 'nullable|string|max:500',
    ]);

    $order = Order::where('order_id', $order_id)->with('offerPrice.payments')->firstOrFail();

    // Save feedback to order_complains table
    $order->complains()->create([
        'customer_feedback' => $request->customer_feedback,
    ]);

    if ($request->customer_confirmation === 'approved') {
        // Check if there is a payment with "success" status (full payment)
        $hasFullPayment = $order->offerPrice->payments()->where('payment_status', 'success')->exists();

        $order->update([
            'status' => $hasFullPayment ? 'waiting_for_shipment' : 'waiting_for_payment',
            'customer_confirmation' => 'approved'
        ]);

        // Send appropriate notification based on payment status
        $notificationMessage = $hasFullPayment
            ? "Anda telah menyetujui hasil pengerjaan. Pesanan Anda sedang disiapkan untuk pengiriman."
            : "Anda telah menyetujui hasil pengerjaan. Mohon segera lakukan pembayaran penuh agar pesanan anda segera dikirim ke alamat anda.";
        
        $this->sendStatusNotification($order, $notificationMessage);
        $this->sendAdminStatusNotification($order, "Pelanggan {$order->offerPrice->purchaseRequest->user->full_name} telah menyetujui pesanan (ID: {$order->order_id}). Silahkan lanjutkan ke proses pengiriman.");
    } else {
        $order->update([
            'status' => 'customer_complain',
            'customer_confirmation' => 'rejected'
        ]);
        
        $this->sendStatusNotification($order, "Anda telah mengkonfirmasi hasil pengerjaan, mohon menunggu revisi pengerjaan pesanan anda terbaru. Terima kasih atas konfirmasinya agar pesanan anda sesuai apa yang anda inginkan :)");
        $this->sendAdminStatusNotification($order, "Pelanggan {$order->offerPrice->purchaseRequest->user->full_name} telah mengajukan keluhan untuk pesanan (ID: {$order->order_id}). Silahkan tinjau dan lakukan revisi.");
    }

    return redirect()->route('orders-customer.show', $order_id)->with('success', 'Konfirmasi berhasil disimpan.');
}

}
