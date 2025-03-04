<?php

namespace App\Http\Controllers;

use App\Models\PurchaseRequest;
use App\Models\Service;
use App\Models\ServiceAdditional;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\OfferPrice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
 

class PurchaseRequestController extends Controller
{
    private $allCouriers = 'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse';

    public function index()
    {
        $user = Auth::user();

        $purchaseRequests = PurchaseRequest::with('service', 'offerPrice')
            ->when($user->role === 'customer', function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('PurchaseRequests/Index', [
            'purchaseRequests' => $purchaseRequests
        ]);
    }

    public function create()
    {
        $services = Service::with('additionals')->get(); // [CHANGED] Load additionals
        return Inertia::render('PurchaseRequests/Create', [
            'services' => $services
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // Log input untuk debugging
        Log::info('Store Purchase Request Input:', $request->all());

        $request->validate([
            'service_id' => 'required|exists:services,id',
            'description' => 'required|string',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'weight' => 'required|numeric|min:0.1|max:999.99',
            'source_use_account_address' => 'required|boolean',
            'destination_use_account_address' => 'required|boolean',
            'shipping_to_admin_selection' => 'required|array',
            'shipping_to_customer_preference' => 'required|array',
            'source_address.address' => 'required_if:source_use_account_address,false|string',
            'source_address.province_name' => 'required_if:source_use_account_address,false|string',
            'source_address.city_name' => 'required_if:source_use_account_address,false|string',
            'source_address.district_name' => 'required_if:source_use_account_address,false|string',
            'source_address.subdistrict_name' => 'required_if:source_use_account_address,false|string',
            'source_address.zip_code' => 'required_if:source_use_account_address,false|string',
            'source_address.address_details' => 'nullable|string',
            'destination_address.address' => 'required_if:destination_use_account_address,false|string',
            'destination_address.province_name' => 'required_if:destination_use_account_address,false|string',
            'destination_address.city_name' => 'required_if:destination_use_account_address,false|string',
            'destination_address.district_name' => 'required_if:destination_use_account_address,false|string',
            'destination_address.subdistrict_name' => 'required_if:destination_use_account_address,false|string',
            'destination_address.zip_code' => 'required_if:destination_use_account_address,false|string',
            'destination_address.address_details' => 'nullable|string',
            'additionals' => 'nullable|array', // [CHANGED] Validasi untuk additionals
            'additionals.*.id' => 'required_with:additionals|exists:service_additionals,id',        ]);

        if ($request->source_use_account_address && !$user->zip_code) {
            return back()->withErrors(['source_address.zip_code' => 'Your account does not have a valid postal code. Please update your profile.']);
        }

        $sourceZipCode = $request->source_use_account_address ? $user->zip_code : $request->input('source_address.zip_code');
        if (!$sourceZipCode) {
            return back()->withErrors(['source_address.zip_code' => 'Please provide a valid source postal code.']);
        }

        $admin = User::where('role', 'admin')->first();
        if (!$admin || !$admin->zip_code) {
            return back()->withErrors(['shipping_cost_to_admin' => 'Admin address not configured.']);
        }
        $destinationZipCodeToAdmin = $admin->zip_code;

        $shippingToAdminSelection = $request->shipping_to_admin_selection;
        $shippingCostToAdmin = $shippingToAdminSelection['cost'];

        $shippingToCustomerPreference = $request->shipping_to_customer_preference;

        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photoPaths[] = $photo->store('purchase_requests', 'public');
            }
        }

        $sourceAddress = $request->source_use_account_address
            ? [
                'province_name' => $user->province_name ?? '',
                'city_name' => $user->city_name ?? '',
                'district_name' => $user->district_name ?? '',
                'subdistrict_name' => $user->subdistrict_name ?? '',
                'zip_code' => $user->zip_code ?? '',
                'address' => $user->address ?? '',
                'address_details' => $user->address_details ?? '',
            ]
            : $request->input('source_address');

        $destinationAddress = $request->destination_use_account_address
            ? [
                'province_name' => $user->province_name ?? '',
                'city_name' => $user->city_name ?? '',
                'district_name' => $user->district_name ?? '',
                'subdistrict_name' => $user->subdistrict_name ?? '',
                'zip_code' => $user->zip_code ?? '',
                'address' => $user->address ?? '',
                'address_details' => $user->address_details ?? '',
            ]
            : $request->input('destination_address');

        // [CHANGED] Proses additional_details
    $additionalDetails = [];
    if ($request->has('additionals')) {
        $additionals = ServiceAdditional::whereIn('id', array_column($request->additionals, 'id'))->get();
        foreach ($additionals as $additional) {
            $additionalDetails[] = [
                'id' => $additional->id,
                'type' => $additional->additional_type_id, // Ubah ke additional_type_id jika sesuai model
                'name' => $additional->name,
                'image_path' => $additional->image_path,
                'additional_price' => $additional->additional_price,
            ];
        }
    }

        $purchaseRequest = PurchaseRequest::create([
            'user_id' => $user->id,
            'service_id' => $request->service_id,
            'description' => $request->description,
            'photo_path' => $photoPaths ?: null,
            'weight' => $request->weight,
            'shipping_cost_to_admin' => $shippingCostToAdmin,
            'shipping_to_admin_details' => $shippingToAdminSelection,
            'source_address' => $sourceAddress,
            'destination_address' => $destinationAddress,
            'shipping_to_customer_preference' => $shippingToCustomerPreference,
            'additional_details' => $additionalDetails,            
            'status' => 'pending',
        ]);

        return redirect()->route('purchase_requests.index')->with('success', 'Purchase Request created successfully.');
    }

    private function calculateShippingCostInternal($origin, $destination, $weight)
    {
        $cacheKey = "shipping_cost_{$origin}_{$destination}_{$weight}";
        $dailyQuotaKey = 'rajaongkir_quota_' . date('Y-m-d');

        return Cache::remember($cacheKey, now()->addDays(7), function () use ($origin, $destination, $weight, $dailyQuotaKey) {
            $remainingQuota = Cache::get($dailyQuotaKey, 100);

            if ($remainingQuota <= 0) {
                Log::warning("API quota exceeded for today");
                return null;
            }

            try {
                $response = Http::asForm()
                    ->withHeaders([
                        'key' => env('RAJAONGKIR_API_KEY'),
                        'Content-Type' => 'application/x-www-form-urlencoded',
                    ])
                    ->post('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', [
                        'origin' => $origin,
                        'destination' => $destination,
                        'weight' => (int)$weight,
                        'courier' => $this->allCouriers,
                        'price' => 'lowest',
                    ]);

                $data = $response->json();

                if ($data['meta']['code'] === 200 && !empty($data['data'])) {
                    Cache::decrement($dailyQuotaKey);
                    Log::info("Shipping costs calculated. Remaining quota: " . Cache::get($dailyQuotaKey, 100));
                    return $data['data'];
                }

                Log::warning("No shipping cost data returned from API");
                return null;
            } catch (\Exception $e) {
                Log::error("Shipping cost API error: " . $e->getMessage());
                return null;
            }
        });
    }

    public function calculateShippingCost(Request $request)
    {
        $request->validate([
            'weight' => 'required|numeric|min:100|max:999990',
            'use_account_address' => 'required|boolean',
            'new_address.zip_code' => 'required_if:use_account_address,false|string',
        ]);

        $user = Auth::user();
        $sourceZipCode = $request->use_account_address ? $user->zip_code : $request->input('new_address.zip_code');

        if (!$sourceZipCode) {
            return response()->json(['error' => 'Invalid source postal code'], 400);
        }

        $admin = User::where('role', 'admin')->first();
        if (!$admin || !$admin->zip_code) {
            return response()->json(['error' => 'Admin address not configured'], 500);
        }
        $destinationZipCode = $admin->zip_code;

        $costs = $this->calculateShippingCostInternal($sourceZipCode, $destinationZipCode, $request->weight);

        if ($costs === null) {
            return response()->json(['error' => 'Failed to calculate shipping cost'], 500);
        }

        return response()->json(['costs' => $costs]);
    }

    public function calculateShippingCostToCustomer(Request $request)
    {
        $request->validate([
            'weight' => 'required|numeric|min:100|max:999990',
            'destination' => 'required|string',
            'origin' => 'required|string',
        ]);

        $destinationZipCode = $request->destination;
        $originZipCode = $request->origin;

        if (!$destinationZipCode || !$originZipCode) {
            return response()->json(['error' => 'Origin or destination postal code not specified'], 400);
        }

        $costs = $this->calculateShippingCostInternal($originZipCode, $destinationZipCode, $request->weight);

        if ($costs === null) {
            return response()->json(['error' => 'Failed to calculate shipping cost'], 500);
        }

        return response()->json(['costs' => $costs]);
    }

    public function show($id)
    {
        $purchaseRequest = PurchaseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->with('service', 'offerPrice')
            ->firstOrFail();

        return Inertia::render('PurchaseRequests/ShowCustomer', [
            'purchaseRequest' => $purchaseRequest
        ]);
    }

    public function acceptOffer($id)
    {
        $purchaseRequest = PurchaseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'offer_sent')
            ->firstOrFail();

        $purchaseRequest->update(['status' => 'waiting_for_dp']);
        return redirect()->route('purchase_requests.show', $id)->with('success', 'Offer accepted.');
    }

    public function rejectOffer($id)
    {
        $purchaseRequest = PurchaseRequest::where('id', $id)
            ->where('user_id', Auth::id())
            ->where('status', 'offer_sent')
            ->firstOrFail();

        $purchaseRequest->update(['status' => 'cancelled']);
        return redirect()->route('purchase_requests.index')->with('success', 'Purchase Request cancelled.');
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

        return redirect()->route('admin.purchaserequests.show', $id)->with('success', 'Offer Price sent successfully.');
    }

    public function edit($id)
    {
    $purchaseRequest = PurchaseRequest::where('id', $id)
        ->where('user_id', Auth::id())
        ->where('status', 'pending')
        ->firstOrFail();

    $services = Service::with('additionals')->get();

    return Inertia::render('PurchaseRequests/Edit', [
        'purchaseRequest' => $purchaseRequest,
        'services' => $services,
    ]);
    }

    public function update(Request $request, $id)
    {
    $user = Auth::user();

    $purchaseRequest = PurchaseRequest::where('id', $id)
        ->where('user_id', $user->id)
        ->where('status', 'pending')
        ->firstOrFail();

    $request->validate([
        'service_id' => 'required|exists:services,id',
        'description' => 'required|string',
        'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'weight' => 'required|numeric|min:0.1|max:999.99',
        'source_use_account_address' => 'required|boolean',
        'destination_use_account_address' => 'required|boolean',
        'shipping_to_admin_selection' => 'required|array',
        'shipping_to_customer_preference' => 'required|array',
        'source_address.address' => 'required_if:source_use_account_address,false|string',
        'source_address.province_name' => 'required_if:source_use_account_address,false|string',
        'source_address.city_name' => 'required_if:source_use_account_address,false|string',
        'source_address.district_name' => 'required_if:source_use_account_address,false|string',
        'source_address.subdistrict_name' => 'required_if:source_use_account_address,false|string',
        'source_address.zip_code' => 'required_if:source_use_account_address,false|string',
        'source_address.address_details' => 'nullable|string',
        'destination_address.address' => 'required_if:destination_use_account_address,false|string',
        'destination_address.province_name' => 'required_if:destination_use_account_address,false|string',
        'destination_address.city_name' => 'required_if:destination_use_account_address,false|string',
        'destination_address.district_name' => 'required_if:destination_use_account_address,false|string',
        'destination_address.subdistrict_name' => 'required_if:destination_use_account_address,false|string',
        'destination_address.zip_code' => 'required_if:destination_use_account_address,false|string',
        'destination_address.address_details' => 'nullable|string',
        'additionals' => 'nullable|array',
        'additionals.*.id' => 'required_with:additionals|exists:service_additionals,id',
    ]);

    $photoPaths = $purchaseRequest->photo_path ?? [];
    if ($request->hasFile('photos')) {
        if ($photoPaths) {
            foreach ($photoPaths as $path) {
                Storage::disk('public')->delete($path);
            }
        }
        $photoPaths = [];
        foreach ($request->file('photos') as $photo) {
            $photoPaths[] = $photo->store('purchase_requests', 'public');
        }
    }

    $sourceAddress = $request->source_use_account_address
        ? [
            'province_name' => $user->province_name ?? '',
            'city_name' => $user->city_name ?? '',
            'district_name' => $user->district_name ?? '',
            'subdistrict_name' => $user->subdistrict_name ?? '',
            'zip_code' => $user->zip_code ?? '',
            'address' => $user->address ?? '',
            'address_details' => $user->address_details ?? '',
        ]
        : $request->input('source_address');

    $destinationAddress = $request->destination_use_account_address
        ? [
            'province_name' => $user->province_name ?? '',
            'city_name' => $user->city_name ?? '',
            'district_name' => $user->district_name ?? '',
            'subdistrict_name' => $user->subdistrict_name ?? '',
            'zip_code' => $user->zip_code ?? '',
            'address' => $user->address ?? '',
            'address_details' => $user->address_details ?? '',
        ]
        : $request->input('destination_address');

    $additionalDetails = [];
    if ($request->has('additionals')) {
        $additionals = ServiceAdditional::whereIn('id', array_column($request->additionals, 'id'))->get();
        foreach ($additionals as $additional) {
            $additionalDetails[] = [
                'id' => $additional->id,
                'type' => $additional->additional_type_id,
                'name' => $additional->name,
                'image_path' => $additional->image_path,
                'additional_price' => $additional->additional_price,
            ];
        }
    }

    $purchaseRequest->update([
        'service_id' => $request->service_id,
        'description' => $request->description,
        'photo_path' => $photoPaths ?: $purchaseRequest->photo_path,
        'weight' => $request->weight,
        'shipping_cost_to_admin' => $request->shipping_cost_to_admin,
        'shipping_to_admin_details' => $request->shipping_to_admin_selection,
        'source_address' => $sourceAddress,
        'destination_address' => $destinationAddress,
        'shipping_to_customer_preference' => $request->shipping_to_customer_preference,
        'additional_details' => $additionalDetails,
    ]);

    return redirect()->route('purchase_requests.show', $id)
        ->with('success', 'Purchase Request updated successfully.');
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

        return redirect()->route('admin.purchaserequests.show', $id)
            ->with('success', 'Offer Price updated successfully.');
    }
}