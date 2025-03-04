<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipping;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ShippingController extends Controller
{
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

        return redirect()->route('shippings.index')->with('success', 'Pesanan telah dikirim.');
    }

    // Admin mengonfirmasi barang telah diterima oleh kustomer
    public function markAsDelivered($shipping_id)
    {
        $shipping = Shipping::where('shipping_id', $shipping_id)->firstOrFail();
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

        // Buat entri pengiriman baru
        Shipping::create([
            'order_id' => $order->order_id,
            'courier_code' => $shippingDetails['code'],
            'courier_name' => $shippingDetails['name'],
            'courier_service' => $shippingDetails['service'],
            'tracking_number' => $request->tracking_number,
            'shipping_date' => $request->tracking_number ? now() : null, // Set tanggal pengiriman jika ada nomor resi
            'received_date' => null,
            'status' => 'in_transit',
        ]);

        // Update status order berdasarkan apakah nomor resi diisi
        $newStatus = $request->tracking_number ? 'shipped' : 'waiting_for_shipment_tracking';
        $order->update(['status' => $newStatus]);

        return redirect()->route('orders.show', $order->order_id)->with('success', 'Pengiriman berhasil dibuat.' . ($request->tracking_number ? '' : ' Tambahkan nomor resi untuk mengubah status menjadi shipped.'));
    }

public function confirmReceivedCustomer(Request $request, $order_id)
    {
        $order = Order::with(['shipping', 'offerPrice.purchaseRequest'])->where('order_id', $order_id)->firstOrFail();

        // Periksa apakah offerPrice dan purchaseRequest ada sebelum mengakses user_id
        if (!$order->offerPrice || !$order->offerPrice->purchaseRequest || $order->offerPrice->purchaseRequest->user_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses ke pesanan ini.');
        }

        if (!$order->shipping || $order->shipping->status !== 'in_transit') {
            return redirect()->back()->with('error', 'Pengiriman tidak dalam status in_transit.');
        }

        // Update status pengiriman menjadi delivered
        $order->shipping->update([
            'status' => 'delivered',
            'received_date' => now(),
        ]);

        // Update status order menjadi completed
        $order->update(['status' => 'completed']);

        return redirect()->back()->with('success', 'Barang telah dikonfirmasi diterima.');
    }
}
