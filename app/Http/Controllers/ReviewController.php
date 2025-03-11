<?php

namespace App\Http\Controllers;

use App\Models\Shipping;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;


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
}
