<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseRequest;
use App\Models\OfferPrice;

class OfferPriceController extends Controller
{
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
