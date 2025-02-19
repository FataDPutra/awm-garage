<?php

namespace App\Http\Controllers;

use App\Models\PurchaseRequest;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\OfferPrice;

class PurchaseRequestController extends Controller
{
    // Menampilkan daftar Purchase Request untuk customer & admin
    public function index()
    {
        $user = Auth::user();

        $purchaseRequests = PurchaseRequest::with('service')
            ->when($user->role === 'customer', function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('PurchaseRequests/Index', [
            'purchaseRequests' => $purchaseRequests
        ]);
    }

    // Menampilkan form Create Purchase Request
    public function create()
    {
        $services = Service::all();
        return Inertia::render('PurchaseRequests/Create', [
            'services' => $services
        ]);
    }

    // Menyimpan Purchase Request baru
 public function store(Request $request)
{
    $request->validate([
        'service_id' => 'required|exists:services,id',
        'description' => 'required|string',
        'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        'weight' => 'required|numeric',
        'shipping_cost' => 'required|numeric',
    ]);

    $photoPaths = [];

    if ($request->hasFile('photos')) {
        foreach ($request->file('photos') as $photo) {
            $photoPaths[] = $photo->store('purchase_requests', 'public');
        }
    }

    $purchaseRequest = PurchaseRequest::create([
        'user_id' => auth()->id(),
        'service_id' => $request->service_id,
        'description' => $request->description,
        'photo_path' => $photoPaths,  // Tidak perlu json_encode() di sini
        'weight' => $request->weight,
        'shipping_cost' => $request->shipping_cost,
        'status' => 'pending',
    ]);

    return redirect()->route('purchase_requests.index')->with('success', 'Purchase Request berhasil dibuat.');
}


    
    // Customer - Melihat detail Purchase Request
    public function show($id)
    {
        $purchaseRequest = PurchaseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->with('service','offerPrice')
            ->firstOrFail();

            return Inertia::render('PurchaseRequests/ShowCustomer', [
            'purchaseRequest' => $purchaseRequest
        ]);
    }
    
    //  Customer - Menerima Offer Price
    public function acceptOffer($id)
    {
        $purchaseRequest = PurchaseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'offer_sent')
            ->firstOrFail();
            
        $purchaseRequest->update(['status' => 'waiting_for_dp']);
        return redirect()->route('purchase_requests.show', $id)->with('success', 'Anda telah menerima penawaran. Silakan lakukan pembayaran.');
    }

    //  Customer - Menolak Offer Price
    public function rejectOffer($id)
    {
        $purchaseRequest = PurchaseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'offer_sent')
            ->firstOrFail();

        $purchaseRequest->update(['status' => 'cancelled']);

        return redirect()->route('purchase_requests.index')->with('success', 'Purchase Request telah dibatalkan.');
    }
    
    public function adminIndex()
    {
    $purchaseRequests = PurchaseRequest::with('user', 'service', 'offerPrice')
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Admin/PurchaseRequests/Index', [
        'purchaseRequests' => $purchaseRequests
    ]);
    }


    // Admin - Melihat semua Purchase Request
    public function showAdmin($id)
    {
        $purchaseRequest = PurchaseRequest::with('user', 'service', 'offerPrice')
            ->where('id', $id)
            ->firstOrFail();

        return Inertia::render('Admin/PurchaseRequests/Show', [
            'purchaseRequest' => $purchaseRequest
        ]);
    }

public function storeOfferPrice(Request $request, $id)
{
    $request->validate([
        'service_price' => 'required|numeric|min:0',
        'dp_amount' => 'required|numeric|min:0',
        'estimation_days' => 'required|integer|min:1',
        'total_price' => 'required|numeric|min:0',
    ]);

    $purchaseRequest = PurchaseRequest::findOrFail($id);
    
    OfferPrice::create([
        'pr_id' => $id,
        'service_price' => $request->service_price,
        'dp_amount' => $request->dp_amount,
        'estimation_days' => $request->estimation_days,
        'total_price' => $request->total_price,
        'status' => 'pending'
    ]);

    $purchaseRequest->update(['status' => 'offer_sent']);

    return redirect()->route('admin.purchaserequests.show', $id)->with('success', 'Offer Price berhasil dikirim.');
}
}