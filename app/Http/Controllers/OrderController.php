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

    // Menampilkan detail order
    public function show($order_id)
    {
        $order = Order::with('offerPrice.purchaseRequest.service', 'offerPrice.purchaseRequest.user','complains' )
            ->where('order_id', $order_id)
            ->firstOrFail();
        // dd($order);

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
        return redirect()->route('orders.index')->with('success', 'Barang diterima dan sedang diproses.');
    }

    // Mengunggah hasil pengerjaan
public function uploadCompletedPhoto(Request $request, $order_id)
{
    $request->validate([
        'completed_photo.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
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

    return redirect()->route('orders.index')->with('success', 'Foto hasil pengerjaan telah diunggah.');
}



// public function uploadRevisionPhoto(Request $request, $order_id)
// {
//     $request->validate([
//         'revised_photo.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
//     ]);

//     $order = Order::where('order_id', $order_id)->firstOrFail();
//     $existingPhotos = $order->revised_photo_path ?? [];

//     if ($request->hasFile('revised_photo')) {
//         foreach ($request->file('revised_photo') as $file) {
//             $path = $file->store('revised_photos', 'public');
//             $existingPhotos[] = $path;
//         }

//         // Update ke database dengan format JSON
//         $order->update([
//             'revised_photo_path' => $existingPhotos, // Bisa langsung array karena kolom JSON
//             'status' => 'waiting_for_cust_confirmation',
//             'customer_confirmation' => 'pending',
//         ]);
//     }
//     return back()->with('success', 'Foto revisi berhasil diunggah.');
// }
public function uploadRevisionPhoto(Request $request, $order_id)
{
    $request->validate([
        'revised_photo.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
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

    return back()->with('success', 'Foto revisi berhasil diunggah.');
}



    // Mengubah status menjadi "Siap Dikirim"
    public function markAsReadyToShip($order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();
        $order->update([
            'status' => 'waiting_for_shipment'
        ]);

        return redirect()->route('orders.index')->with('success', 'Pesanan siap untuk dikirim.');
    }

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
            'complains'
        ])
        ->whereHas('offerPrice.purchaseRequest', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
        ->where('order_id', $order_id)
        ->firstOrFail();

    return Inertia::render('Orders/CustomerShow', [
        'order' => $order,
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

    return redirect()->back()->with('success', 'Pengiriman barang telah dikonfirmasi.');
}

    // public function confirmCustomerOrder(Request $request, $order_id)
    // {
    //     $request->validate([
    //         'customer_confirmation' => 'required|in:approved,rejected',
    //         'customer_feedback' => 'nullable|string|max:500',
    //     ]);

    //     $order = Order::where('order_id', $order_id)->firstOrFail();

    //     if ($request->customer_confirmation === 'approved') {
    //         $order->update([
    //             'customer_confirmation' => 'approved',
    //             'status' => 'waiting_for_payment'
    //         ]);
    //     } else {
    //         $order->update([
    //             'customer_confirmation' => 'rejected',
    //             'customer_feedback' => $request->customer_feedback,
    //             'status' => 'customer_complain'
    //         ]);
    //     }
    //     return redirect()->route('orders-customer.show', $order_id)->with('success', 'Konfirmasi berhasil disimpan.');
        
    // }

    public function confirmCustomerOrder(Request $request, $order_id)
    {
    $request->validate([
        'customer_confirmation' => 'required|in:approved,rejected',
        'customer_feedback' => 'nullable|string|max:500',
    ]);

    $order = Order::where('order_id', $order_id)->firstOrFail();

    // Simpan feedback ke tabel order_complains
    $order->complains()->create([
        // 'customer_confirmation' => $request->customer_confirmation,
        'customer_feedback' => $request->customer_feedback,
    ]);

    if ($request->customer_confirmation === 'approved') {
        $order->update([
            'status' => 'waiting_for_payment',
            'customer_confirmation' => 'approved'
        ]);
    } else {
        $order->update([
            'status' => 'customer_complain',
            'customer_confirmation' => 'rejected'
        ]);
    }
    return redirect()->route('orders-customer.show', $order_id)->with('success', 'Konfirmasi berhasil disimpan.');
}
}
