<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipping;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShippingController extends Controller
{
    /**
     * Mengirim notifikasi WhatsApp berdasarkan status Shipping jika nomor terverifikasi
     */
    private function sendStatusNotification($order, $statusMessage, $trackingNumber = null, $courierCode = null)
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

        // Tambahkan informasi pengiriman jika ada tracking number dan courier code
        if ($trackingNumber && $courierCode) {
            $courierName = $this->getCourierName($courierCode);
            $trackingUrl = $this->getTrackingUrl($courierCode, $trackingNumber);
            $message .= " Dikirim melalui {$courierName} dengan nomor resi: {$trackingNumber}. Lacak di: {$trackingUrl} Silahkan pantau pesanan anda secara berkala melalui website http://awmgarage.com";
        } elseif ($trackingNumber) {
            $message .= " Nomor resi: {$trackingNumber}. Silahkan pantau pesanan anda secara berkala melalui website http://awmgarage.com";
        }

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
     * Mendapatkan nama kurir berdasarkan kode kurir
     */
    private function getCourierName($courierCode)
    {
        $courierNames = [
            'jne' => 'JNE',
            'pos' => 'Pos Indonesia',
            'tiki' => 'TIKI',
            'sicepat' => 'SiCepat',
            'jnt' => 'J&T Express',
            // Tambahkan kurir lain sesuai kebutuhan
        ];

        return $courierNames[$courierCode] ?? ucfirst($courierCode);
    }

    /**
     * Mendapatkan URL pelacakan berdasarkan kode kurir dan nomor resi
     */
    private function getTrackingUrl($courierCode, $trackingNumber)
    {
        $trackingUrls = [
            'jne' => "https://www.jne.co.id/id/tracking/trace?awb={$trackingNumber}",
            'pos' => "https://www.posindonesia.co.id/id/tracking?resi={$trackingNumber}",
            'tiki' => "https://www.tiki.id/id/tracking?noresi={$trackingNumber}",
            'sicepat' => "https://www.sicepat.com/checkAwb/{$trackingNumber}",
            'jnt' => "https://www.jtexpress.co.id/track?waybill={$trackingNumber}",
            // Tambahkan URL pelacakan resmi kurir lain sesuai kebutuhan
        ];

        return $trackingUrls[$courierCode] ?? 'URL pelacakan tidak tersedia';
    }

    // Menampilkan daftar pengiriman
    public function index()
    {
        $shippings = Shipping::with('order.offerPrice.purchaseRequest.user')
            ->orderBy('shipping_date', 'desc')
            ->get();

        return Inertia::render('Shipping/Index', [
            'shippings' => $shippings
        ]);
    }

    // Menampilkan detail pengiriman
    public function show($shipping_id)
    {
        $shipping = Shipping::with('order.offerPrice.purchaseRequest.user')
            ->where('shipping_id', $shipping_id)
            ->firstOrFail();

        return Inertia::render('Shipping/Show', [
            'shipping' => $shipping
        ]);
    }

    // Admin menginput data pengiriman
    public function store(Request $request, $order_id)
    {
        $request->validate([
            'courier_code' => 'required|string|max:20',
            'courier_service' => 'required|string|max:50',
            'tracking_number' => 'required|string|max:100'
        ]);

        $order = Order::where('order_id', $order_id)->firstOrFail();

        // Buat data pengiriman
        $shipping = Shipping::create([
            'order_id' => $order->order_id,
            'courier_code' => $request->courier_code,
            'courier_service' => $request->courier_service,
            'tracking_number' => $request->tracking_number,
            'shipping_date' => now(),
            'status' => 'in_transit'
        ]);

        // Update status order menjadi "shipped"
        $order->update(['status' => 'shipped']);

        // Kirim notifikasi dengan informasi kurir dan URL pelacakan jika nomor terverifikasi
        $this->sendStatusNotification($order, "Pesanan Anda telah dikirim", $request->tracking_number, $request->courier_code);

        return redirect()->route('shippings.index')->with('success', 'Pesanan telah dikirim.');
    }

    // Admin mengonfirmasi barang telah diterima oleh kustomer
    public function markAsDelivered($shipping_id)
    {
        $shipping = Shipping::where('shipping_id', $shipping_id)->firstOrFail();
        $order = $shipping->order;

        $shipping->update([
            'status' => 'delivered',
            'received_date' => now()
        ]);

        // Kirim notifikasi jika nomor terverifikasi
        // $this->sendStatusNotification($order, "Pesanan Anda telah diterima.");

        return redirect()->route('shippings.index')->with('success', 'Pesanan telah diterima oleh kustomer.');
    }

    public function createShipment(Request $request, $order_id)
    {
        $order = Order::with('offerPrice')->where('order_id', $order_id)->firstOrFail();

        if ($order->status !== 'waiting_for_shipment') {
            return redirect()->back()->with('error', 'Order tidak dalam status waiting_for_shipment.');
        }

        $request->validate([
            'tracking_number' => 'nullable|string|max:100',
        ]);

        $shippingDetails = $order->offerPrice->shipping_to_customer_details;

        // Buat entri pengiriman baru
        $shipping = Shipping::create([
            'order_id' => $order->order_id,
            'courier_code' => $shippingDetails['code'],
            'courier_name' => $shippingDetails['name'],
            'courier_service' => $shippingDetails['service'],
            'tracking_number' => $request->tracking_number,
            'shipping_date' => $request->tracking_number ? now() : null,
            'received_date' => null,
            'status' => 'in_transit',
        ]);

        // Update status order berdasarkan apakah nomor resi diisi
        $newStatus = $request->tracking_number ? 'shipped' : 'waiting_for_shipment_tracking';
        $order->update(['status' => $newStatus]);

        // Kirim notifikasi dengan informasi kurir dan URL pelacakan jika ada nomor resi dan nomor terverifikasi
        if ($request->tracking_number) {
            $this->sendStatusNotification($order, "Pesanan Anda telah dikirim", $request->tracking_number, $shippingDetails['code']);
        }

        return redirect()->route('orders.show', $order->order_id)->with('success', 'Pengiriman berhasil dibuat.' . ($request->tracking_number ? '' : ' Tambahkan nomor resi untuk mengubah status menjadi shipped.'));
    }

    public function confirmReceivedCustomer(Request $request, $order_id)
    {
        $order = Order::with(['shipping', 'offerPrice.purchaseRequest', 'review'])
            ->where('order_id', $order_id)
            ->firstOrFail();

        if (!$order->offerPrice || !$order->offerPrice->purchaseRequest || $order->offerPrice->purchaseRequest->user_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses ke pesanan ini.');
        }

        if (!$order->shipping || $order->shipping->status !== 'in_transit') {
            return redirect()->back()->with('error', 'Pengiriman tidak dalam status in_transit.');
        }

        $request->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'review_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $order->shipping->update([
            'status' => 'delivered',
            'received_date' => now(),
        ]);

        $order->update(['status' => 'completed']);

        if ($order->offerPrice->purchaseRequest) {
            $order->offerPrice->purchaseRequest->update(['status' => 'done']);
        }

        // Simpan rating, review, dan multiple gambar jika ada
        if ($request->has('rating') || $request->has('review') || $request->hasFile('review_images')) {
            $imagePaths = [];
            if ($request->hasFile('review_images')) {
                foreach ($request->file('review_images') as $image) {
                    $imagePaths[] = $image->store('review_images', 'public');
                }
            }

            Review::updateOrCreate(
                ['order_id' => $order->order_id],
                [
                    'rating' => $request->rating,
                    'review' => $request->review,
                    'image_paths' => $imagePaths,
                ]
            );
        }

        // Kirim notifikasi jika nomor terverifikasi
        $this->sendStatusNotification($order, "Anda telah mengonfirmasi barang telah diterima. Mohon berikan rating untuk pesanan Anda. Terima Kasih telah memesanan layanan kami :)");

        return redirect()->back()->with('success', 'Barang telah dikonfirmasi diterima.');
    }

    
}