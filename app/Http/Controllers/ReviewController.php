<?php

namespace App\Http\Controllers;

use App\Models\Shipping;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


class ReviewController extends Controller
{
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

public function index()    
    {
        // Data dummy dari data.js (hard-coded untuk simulasi)
        $dummyReviews = [
            [
                'id' => 'dummy_1',
                'name' => 'John Doe',
                'comment' => 'Pelayanan sangat memuaskan, hasil vaporblasting seperti baru! Tim AWM Garage sangat profesional dan ramah.',
                'image' => '/portofolio/portofolio1.jpeg',
                'rating' => 5,
            ],
            [
                'id' => 'dummy_2',
                'name' => 'Jane Smith',
                'comment' => 'Chrome coating-nya sangat mengkilap dan tahan lama, terima kasih AWM Garage atas hasil yang luar biasa!',
                'image' => '/portofolio/portofolio2.jpeg',
                'rating' => 4,
            ],
            [
                'id' => 'dummy_3',
                'name' => 'Alice Johnson',
                'comment' => 'Sandblasting cepat, rapi, dan hasilnya memuaskan. Bengkel ini benar-benar recommended!',
                'image' => '/portofolio/portofolio3.jpeg',
                'rating' => 5,
            ],
            [
                'id' => 'dummy_4',
                'name' => 'Bob Brown',
                'comment' => 'Bengkel yang sangat profesional dengan harga bersaing, pasti kembali lagi untuk layanan lainnya!',
                'image' => '/portofolio/portofolio4.jpg',
                'rating' => 4,
            ],
        ];

        // Ambil review dari database
        $dbReviews = Review::with(['order.offerPrice.purchaseRequest.user'])
            ->get()
            ->map(function ($review) {
                // Ambil hanya satu gambar dari completed_photo_path
                $imagePath = is_array($review->order->completed_photo_path) && !empty($review->order->completed_photo_path)
                    ? $review->order->completed_photo_path[0]
                    : null;
                $imageUrl = $imagePath ? Storage::url($imagePath) : '/portofolio/default.png';

                return [
                    'id' => $review->id,
                    'name' => $review->order->offerPrice->purchaseRequest->user->full_name ?? 'Anonymous',
                    'comment' => $review->review,
                    'rating' => $review->rating,
                    'image' => $imageUrl,
                ];
            })->toArray();

        // Gabungkan data: dummy reviews dulu, lalu database reviews
        $reviews = array_merge($dummyReviews, $dbReviews);

        return response()->json($reviews);
    }
}