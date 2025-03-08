<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipping;
use App\Models\Review;
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
            'review_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validasi multiple gambar
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

        return redirect()->back()->with('success', 'Barang telah dikonfirmasi diterima.');
    }

public function storeReview(Request $request, $order_id)
{
    try {
        $order = Order::with(['offerPrice.purchaseRequest', 'reviews'])
            ->where('order_id', $order_id)
            ->firstOrFail();

        if (!$order->offerPrice || !$order->offerPrice->purchaseRequest || $order->offerPrice->purchaseRequest->user_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses ke pesanan ini.');
        }

        if ($order->status !== 'completed') {
            return redirect()->back()->with('error', 'Pesanan belum selesai untuk diberi ulasan.');
        }

        \Log::info('Request data:', $request->all());
        \Log::info('Files in request:', $request->file('review_media') ? array_keys($request->file('review_media')) : 'No files');
        \Log::info('Raw request files:', $_FILES); // Log raw PHP files array

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'review_media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi,quicktime|max:10240',
        ]);

        $mediaPaths = [];
        if ($request->hasFile('review_media')) {
            $files = $request->file('review_media');
            foreach ($files as $index => $media) {
                \Log::info("Processing file at index $index:", [
                    'name' => $media->getClientOriginalName(),
                    'mime' => $media->getMimeType(),
                    'size' => $media->getSize(),
                    'path' => $media->getPathname(),
                    'valid' => $media->isValid(),
                    'error' => $media->getError(),
                    'error_message' => $media->getErrorMessage(),
                ]);

                if ($media->isValid()) {
                    $path = $media->store('review_media', 'public');
                    \Log::info("Stored file at index $index: " . $path);
                    $mediaPaths[] = $path;
                } else {
                    \Log::warning("File at index $index failed: " . $media->getClientOriginalName());
                }
            }
        } else {
            \Log::info('No valid files uploaded');
        }

        $review = new Review([
            'order_id' => $order->order_id,
            'rating' => $request->rating,
            'review' => $request->review,
            'media_paths' => $mediaPaths,
        ]);
        $review->save();

        \Log::info('Review saved successfully for order: ' . $order_id);

        return redirect()->back()->with('success', 'Rating dan review berhasil disimpan.');
    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('Validation failed: ' . $e->getMessage(), $e->errors());
        return redirect()->back()->withErrors($e->errors())->with('error', 'Validasi gagal.');
    } catch (\Exception $e) {
        \Log::error('Error saving review: ' . $e->getMessage(), ['exception' => $e]);
        return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan review: ' . $e->getMessage());
    }
}
}