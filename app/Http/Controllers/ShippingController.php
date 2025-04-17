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
    private function sendStatusNotification($order, $statusMessage, $trackingNumber = null, $courierCode = null)
    {
        $user = $order->offerPrice->purchaseRequest->user;

        if (!$user->phone_verified_at) {
            \Log::info('Notifikasi tidak dikirim karena nomor belum diverifikasi', ['user_id' => $user->id]);
            return;
        }

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo {$user->full_name}, pesanan Anda (ID: {$order->order_id}) telah diperbarui: {$statusMessage} Silahkan pantau pesanan anda secara berkala melalui website http://awmgarage.com";

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

    private function getCourierName($courierCode)
    {
        $courierNames = [
            'jne' => 'JNE',
            'pos' => 'Pos Indonesia',
            'tiki' => 'TIKI',
            'sicepat' => 'SiCepat',
            'jnt' => 'J&T Express',
        ];

        return $courierNames[$courierCode] ?? ucfirst($courierCode);
    }

    private function getTrackingUrl($courierCode, $trackingNumber)
    {
        $trackingUrls = [
            'jne' => "https://www.jne.co.id/id/tracking/trace?awb={$trackingNumber}",
            'pos' => "https://www.posindonesia.co.id/id/tracking?resi={$trackingNumber}",
            'tiki' => "https://www.tiki.id/id/tracking?noresi={$trackingNumber}",
            'sicepat' => "https://www.sicepat.com/checkAwb/{$trackingNumber}",
            'jnt' => "https://www.jtexpress.co.id/track?waybill={$trackingNumber}",
        ];

        return $trackingUrls[$courierCode] ?? 'URL pelacakan tidak tersedia';
    }

    public function index()
    {
        $shippings = Shipping::with('order.offerPrice.purchaseRequest.user')
            ->orderBy('shipping_date', 'desc')
            ->get();

        return Inertia::render('Shipping/Index', [
            'shippings' => $shippings
        ]);
    }

    public function show($shipping_id)
    {
        $shipping = Shipping::with('order.offerPrice.purchaseRequest.user')
            ->where('shipping_id', $shipping_id)
            ->firstOrFail();

        return Inertia::render('Shipping/Show', [
            'shipping' => $shipping
        ]);
    }

    public function store(Request $request, $order_id)
    {
        $request->validate([
            'courier_code' => 'required|string|max:20',
            'courier_service' => 'required|string|max:50',
            'tracking_number' => 'required|string|max:100'
        ]);

        $order = Order::where('order_id', $order_id)->firstOrFail();

        $shipping = Shipping::create([
            'order_id' => $order->order_id,
            'courier_code' => $request->courier_code,
            'courier_service' => $request->courier_service,
            'tracking_number' => $request->tracking_number,
            'shipping_date' => now(),
            'status' => 'in_transit'
        ]);

        $order->update(['status' => 'shipped']);

        $this->sendStatusNotification($order, "Pesanan Anda telah dikirim", $request->tracking_number, $request->courier_code);

        return redirect()->route('shippings.index')->with('success', 'Pesanan telah dikirim.');
    }

    public function markAsDelivered($shipping_id)
    {
        $shipping = Shipping::where('shipping_id', $shipping_id)->firstOrFail();
        $order = $shipping->order;

        $shipping->update([
            'status' => 'delivered',
            'received_date' => now()
        ]);

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

        $newStatus = $request->tracking_number ? 'shipped' : 'waiting_for_shipment_tracking';
        $order->update(['status' => $newStatus]);

        if ($request->tracking_number) {
            $this->sendStatusNotification($order, "Pesanan Anda telah dikirim", $request->tracking_number, $shippingDetails['code']);
        }

        return redirect()->route('orders.show', $order->order_id)->with('success', 'Pengiriman berhasil dibuat.' . ($request->tracking_number ? '' : ' Tambahkan nomor resi untuk mengubah status menjadi shipped.'));
    }

    public function confirmReceivedCustomer(Request $request, $order_id)
    {
        \Log::info('Memulai confirmReceivedCustomer', [
            'order_id' => $order_id,
            'user_id' => auth()->id(),
            'input' => $request->all()
        ]);

        try {
            $order = Order::with(['shipping', 'offerPrice.purchaseRequest'])
                ->where('order_id', $order_id)
                ->firstOrFail();

            if (!$order->offerPrice || !$order->offerPrice->purchaseRequest || $order->offerPrice->purchaseRequest->user_id !== auth()->id()) {
                \Log::warning('Akses ditolak', ['order_id' => $order_id]);
                return redirect()->back()->with('error', 'Anda tidak memiliki akses ke pesanan ini.');
            }

            if (!$order->shipping || $order->shipping->status !== 'in_transit') {
                \Log::warning('Status pengiriman tidak valid', [
                    'order_id' => $order_id,
                    'shipping_status' => $order->shipping ? $order->shipping->status : null
                ]);
                return redirect()->back()->with('error', 'Pengiriman tidak dalam status in_transit.');
            }

            \DB::transaction(function () use ($order) {
                $order->shipping->update([
                    'status' => 'delivered',
                    'received_date' => now(),
                ]);
                \Log::info('Shipping updated', ['order_id' => $order->order_id, 'status' => 'delivered']);

                $order->update(['status' => 'completed']);
                \Log::info('Order updated', ['order_id' => $order->order_id, 'status' => 'completed']);

                if ($order->offerPrice->purchaseRequest) {
                    $order->offerPrice->purchaseRequest->update(['status' => 'done']);
                    \Log::info('Purchase request updated', ['order_id' => $order->order_id]);
                }
            });

            $this->sendStatusNotification($order, "Anda telah mengonfirmasi barang telah diterima. Mohon berikan rating untuk pesanan Anda. Terima Kasih telah memesanan layanan kami :)");

            \Log::info('Proses confirmReceivedCustomer selesai', ['order_id' => $order_id]);

            return redirect()->back()->with('success', 'Barang telah dikonfirmasi diterima.');
        } catch (\Exception $e) {
            \Log::error('Error di confirmReceivedCustomer', [
                'order_id' => $order_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}