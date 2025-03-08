<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Ambil semua order dengan relasi OfferPrice, PurchaseRequest, dan User, urutkan berdasarkan created_at ascending
        $orders = Order::with(['offerPrice.purchaseRequest.user'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Log untuk debugging
        Log::info('Dashboard Data Sent:', [
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'full_name' => $user->full_name,
                    'role' => $user->role,
                ],
            ],
            'orders_count' => $orders->count(),
            'sample_order' => $orders->first() ? $orders->first()->toArray() : null,
        ]);

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => [
                    'username' => $user->username,
                    'full_name' => $user->full_name,
                    'role' => $user->role,
                ],
            ],
            'orders' => $orders->map(function ($order) {
                $shippingDaysToAdmin = 0;
                if ($order->offerPrice && $order->offerPrice->purchaseRequest && $order->offerPrice->purchaseRequest->shipping_to_admin_details) {
                    // Ambil estimasi hari pengiriman dari customer ke admin
                    $shippingDetails = $order->offerPrice->purchaseRequest->shipping_to_admin_details;
                    $shippingDaysToAdmin = isset($shippingDetails['etd']) 
                        ? (int) filter_var($shippingDetails['etd'], FILTER_SANITIZE_NUMBER_INT) 
                        : 2; // Fallback ke 2 hari jika tidak ada etd
                }

                return [
                    'order_id' => $order->order_id,
                    'status' => $order->status,
                    'created_at' => $order->created_at->toIso8601String(),
                    'estimation_days' => $order->offerPrice ? $order->offerPrice->estimation_days : 3, // Waktu pengerjaan admin
                    'shipping_days_to_admin' => $shippingDaysToAdmin, // Hari pengiriman ke admin
                    'username' => $order->offerPrice && $order->offerPrice->purchaseRequest && $order->offerPrice->purchaseRequest->user 
                        ? $order->offerPrice->purchaseRequest->user->username 
                        : 'Unknown', // Fallback jika username tidak tersedia
                        'service_name' => ($order->offerPrice && $order->offerPrice->purchaseRequest && $order->offerPrice->purchaseRequest->service) 
                        ? $order->offerPrice->purchaseRequest->service->service_name : 'Unknown',                
                    ];
            })->values(),
        ]);
    }
}