<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Location;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LocationController extends Controller
{
    public function search(Request $request)
    {
        $query = trim($request->query('search', ''));

        if (strlen($query) <= 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'Query must be longer than 2 characters',
                'data' => []
            ], 200);
        }

        $cacheKey = 'location_search_' . md5($query);
        Log::info('Search initiated for: ' . $query);


        $results = Cache::remember($cacheKey, now()->addDays(7), function () use ($query) {
            // Prioritaskan database lokal
            $localResults = Location::where('label', 'like', "%{$query}%")
                ->orWhere('province_name', 'like', "%{$query}%")
                ->orWhere('city_name', 'like', "%{$query}%")
                ->orWhere('district_name', 'like', "%{$query}%")
                ->orWhere('subdistrict_name', 'like', "%{$query}%")
                ->limit(5)
                ->get();

            if ($localResults->isNotEmpty()) {
                return $localResults->toArray();
            }

            // Cek quota API
            $dailyQuotaKey = 'rajaongkir_quota_' . date('Y-m-d');
            $remainingQuota = Cache::get($dailyQuotaKey, 100);

            if ($remainingQuota <= 0) {
                Log::warning("API quota exceeded for today");
                return [];
            }

            // Panggil API
            try {
  $response = Http::withHeaders([
    'key' => env('RAJAONGKIR_API_KEY'),
])->get('https://rajaongkir.komerce.id/api/v1/destination/domestic-destination', [
    'search' => $query,
    'limit' => 5,
    'offset' => 0
]);
Log::info('Status: ' . $response->status());
Log::info('Isi Respons: ' . $response->body());
$data = $response->json();
Log::info('Data: ', $data);

                if (isset($data['data']) && is_array($data['data'])) {
                    foreach ($data['data'] as $location) {
                        Location::updateOrCreate(
                            ['id' => $location['id']],
                            [
                                'label' => $location['label'],
                                'province_name' => $location['province_name'],
                                'city_name' => $location['city_name'],
                                'district_name' => $location['district_name'],
                                'subdistrict_name' => $location['subdistrict_name'],
                                'zip_code' => $location['zip_code'],
                            ]
                        );
                    }
                    Cache::decrement($dailyQuotaKey);
                    Log::info("Remaining API quota: " . Cache::get($dailyQuotaKey, 100));
                    return $data['data'];
                }
                return [];
            } catch (\Exception $e) {
                Log::error("Location API error: " . $e->getMessage());
                return [];
            }
        });

        Log::info('Direct query results: ', $results);

        return response()->json([
            'status' => 'success',
            'data' => $results
        ]);
    }
}