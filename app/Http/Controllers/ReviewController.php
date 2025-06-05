<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
 public function storeReview(Request $request, $order_id)
    {
        try {
            $order = Order::with(['offerPrice.purchaseRequest'])
                ->where('order_id', $order_id)
                ->firstOrFail();

            // Validasi akses pengguna
            if (!$order->offerPrice || !$order->offerPrice->purchaseRequest || $order->offerPrice->purchaseRequest->user_id !== auth()->id()) {
                return redirect()->back()->with('error', 'Anda tidak memiliki akses ke pesanan ini.');
            }

            // Validasi status pesanan
            if ($order->status !== 'completed') {
                return redirect()->back()->with('error', 'Pesanan belum selesai untuk diberi ulasan.');
            }

            // Validasi input
            $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'nullable|string|max:1000',
                'review_media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,heic,heif,mp4,mov,avi,quicktime|max:10240',
            ], [
                'rating.required' => 'Rating wajib diisi.',
                'rating.integer' => 'Rating harus berupa angka.',
                'rating.min' => 'Rating minimal 1.',
                'rating.max' => 'Rating maksimal 5.',
                'review.max' => 'Ulasan maksimal 1000 karakter.',
                'review_media.*.file' => 'Media harus berupa file.',
                'review_media.*.mimes' => 'Media harus berformat JPEG, PNG, JPG, GIF, HEIC, HEIF, MP4, MOV, atau AVI.',
                'review_media.*.max' => 'Setiap media maksimal 10MB.',
            ]);

            // Log request untuk debugging
            Log::info('Store Review Request Data:', $request->all());
            if ($request->hasFile('review_media')) {
                $files = $request->file('review_media');
                $fileDetails = collect($files)->map(function ($file) {
                    return [
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'mime' => $file->getMimeType(),
                    ];
                })->all();
                Log::info('Uploaded review media details:', $fileDetails);
            } else {
                Log::info('No review media uploaded.');
            }

            // Proses file media
            $mediaPaths = [];
            if ($request->hasFile('review_media')) {
                foreach ($request->file('review_media') as $index => $media) {
                    if ($media->isValid()) {
                        $path = $media->store('review_media', 'public');
                        $mediaPaths[] = $path;
                        Log::info("Stored review media at index $index:", [
                            'path' => $path,
                            'name' => $media->getClientOriginalName(),
                            'mime' => $media->getMimeType(),
                            'size' => $media->getSize(),
                        ]);
                    } else {
                        Log::warning("Invalid review media at index $index:", [
                            'name' => $media->getClientOriginalName(),
                            'error' => $media->getErrorMessage(),
                        ]);
                    }
                }
            }

            // Simpan review
            $review = new Review([
                'order_id' => $order->order_id,
                'rating' => $request->rating,
                'review' => $request->review ?: null,
                'media_paths' => $mediaPaths,
            ]);
            $review->save();

            Log::info('Review saved successfully for order:', ['order_id' => $order_id]);

            return redirect()->back()->with('success', 'Rating dan review berhasil disimpan.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed for review:', [
                'errors' => $e->errors(),
                'request' => $request->all(),
            ]);
            return redirect()->back()->withErrors($e->errors())->with('error', 'Validasi gagal.');
        } catch (\Exception $e) {
            Log::error('Error saving review:', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan review.');
        }
    }

    public function index()
    {
        // Data dummy
        $dummyReviews = [
            [
                'id' => 'dummy_1',
                'name' => 'Yoyok Supriyanto',
                'comment' => 'Pelayanan sangat memuaskan, hasil vaporblasting seperti baru! Tim AWM Garage sangat profesional dan ramah.',
                'image' => '/portofolio/portofolio1.jpeg',
                'rating' => 5,
            ],
            [
                'id' => 'dummy_2',
                'name' => 'Budi Hariono',
                'comment' => 'Chrome coating-nya sangat mengkilap dan tahan lama, terima kasih AWM Garage atas hasil yang luar biasa!',
                'image' => '/portofolio/portofolio2.jpeg',
                'rating' => 4,
            ],
            [
                'id' => 'dummy_3',
                'name' => 'Pujo Setiawan',
                'comment' => 'Sandblasting cepat, rapi, dan hasilnya memuaskan. Bengkel ini benar-benar recommended!',
                'image' => '/portofolio/portofolio3.jpeg',
                'rating' => 5,
            ],
            [
                'id' => 'dummy_4',
                'name' => 'Heru Darmawan',
                'comment' => 'Bengkel yang sangat profesional dengan harga bersaing, pasti kembali lagi untuk layanan lainnya!',
                'image' => '/portofolio/portofolio4.jpeg',
                'rating' => 4,
            ],
        ];

        // Ambil review dari database
        $dbReviews = Review::with(['order.offerPrice.purchaseRequest.user'])
            ->get()
            ->map(function ($review) {
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
                    'media_paths' => $review->media_paths ?? [],
                ];
            })->toArray();

        // Gabungkan data
        $reviews = array_merge($dummyReviews, $dbReviews);

        return response()->json($reviews);
    }
}