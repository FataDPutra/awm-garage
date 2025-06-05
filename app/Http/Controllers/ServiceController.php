<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceAdditional;
use App\Models\AdditionalType;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('additionals.additionalType')->get();
        return Inertia::render('Services/Index', ['services' => $services]);
    }

    public function customerIndex()
    {
        $services = Service::select('id', 'service_name', 'description', 'base_price')->get();
        return Inertia::render('Services/CustomerServices', ['services' => $services]);
    }

    public function show($id)
    {
        $service = Service::with('additionals.additionalType')->findOrFail($id);
        $additionalTypes = AdditionalType::all();
        $completedPhotos = Order::whereHas('offerPrice.purchaseRequest', function ($query) use ($id) {
            $query->where('service_id', $id);
        })
            ->whereNotNull('completed_photo_path')
            ->pluck('completed_photo_path')
            ->flatMap(function ($photos) {
                return is_array($photos) ? $photos : [];
            })
            ->filter()
            ->values()
            ->toArray();

        Log::info('Service data for show:', [
            'service_id' => $service->id,
            'service_name' => $service->service_name,
            'additionals' => $service->additionals->map(function ($additional) {
                return [
                    'id' => $additional->id,
                    'name' => $additional->name,
                    'additional_type_id' => $additional->additional_type_id,
                    'additional_type_name' => optional($additional->additionalType)->name,
                ];
            })->toArray(),
            'additionalTypes' => $additionalTypes->toArray(),
        ]);

        return Inertia::render('Services/ServiceDetail', [
            'service' => $service,
            'additionalTypes' => $additionalTypes,
            'completedPhotos' => $completedPhotos,
        ]);
    }

    public function adminShow($id)
    {
        $service = Service::with('additionals.additionalType')->findOrFail($id);
        $additionalTypes = AdditionalType::all();
        $completedPhotos = Order::whereHas('offerPrice.purchaseRequest', function ($query) use ($id) {
            $query->where('service_id', $id);
        })
            ->whereNotNull('completed_photo_path')
            ->pluck('completed_photo_path')
            ->flatMap(function ($photos) {
                return is_array($photos) ? $photos : [];
            })
            ->filter()
            ->values()
            ->toArray();

        Log::info('Service data for admin show:', [
            'service_id' => $service->id,
            'service_name' => $service->service_name,
            'additionals' => $service->additionals->map(function ($additional) {
                return [
                    'id' => $additional->id,
                    'name' => $additional->name,
                    'additional_type_id' => $additional->additional_type_id,
                    'additional_type_name' => optional($additional->additionalType)->name,
                ];
            })->toArray(),
            'additionalTypes' => $additionalTypes->toArray(),
        ]);

        return Inertia::render('Services/ServiceAdminDetail', [
            'service' => $service,
            'additionalTypes' => $additionalTypes,
            'completedPhotos' => $completedPhotos,
        ]);
    }

    public function create()
    {
        $additionalTypes = AdditionalType::all();
        return Inertia::render('Services/Create', ['additionalTypes' => $additionalTypes]);
    }

    public function store(Request $request)
    {
        Log::info('Store Service Request Input:', $request->all());
        if ($request->hasFile('additionals.*.image')) {
            $fileDetails = collect($request->file('additionals'))->map(function ($file, $index) {
                return [
                    'index' => $index,
                    'name' => $file['image']->getClientOriginalName(),
                    'size' => $file['image']->getSize(),
                    'mime' => $file['image']->getMimeType(),
                ];
            })->all();
            Log::info('Uploaded files details:', $fileDetails);
        }

        $request->validate([
            'service_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'base_price' => 'required|numeric|min:0',
            'additionals' => 'nullable|array',
            'additionals.*.additional_type_id' => 'nullable|exists:additional_types,id',
            'additionals.*.new_type' => 'nullable|string|max:100|unique:additional_types,name',
            'additionals.*.name' => 'required_with:additionals|string|max:255',
            'additionals.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,heic,heif|max:10240',
            'additionals.*.additional_price' => 'nullable|numeric|min:0',
        ], [
            'additionals.*.image.mimes' => 'Gambar harus berformat JPEG, PNG, JPG, GIF, HEIC, atau HEIF.',
            'additionals.*.image.max' => 'Setiap gambar maksimal 10MB.',
            'additionals.*.new_type.unique' => 'Tipe tambahan sudah ada.',
            'additionals.*.new_type.max' => 'Nama tipe tambahan maksimal 100 karakter.',
        ]);

        $service = Service::create([
            'service_name' => $request->service_name,
            'description' => $request->description,
            'base_price' => $request->base_price,
        ]);

        if ($request->has('additionals')) {
            foreach ($request->additionals as $index => $additional) {
                $additionalTypeId = $additional['additional_type_id'];
                if (!$additionalTypeId && !empty($additional['new_type'])) {
                    $newType = AdditionalType::firstOrCreate(['name' => $additional['new_type']]);
                    $additionalTypeId = $newType->id;
                    Log::info('Created new AdditionalType:', ['name' => $newType->name, 'id' => $newType->id]);
                }
                if (!$additionalTypeId) {
                    Log::warning('Skipping additional due to null additional_type_id:', ['additional' => $additional]);
                    continue;
                }

                $imagePath = null;
                if ($request->hasFile("additionals.{$index}.image")) {
                    $imagePath = $request->file("additionals.{$index}.image")->store('service_additionals', 'public');
                    Log::info('Stored image:', ['path' => $imagePath, 'mime' => $request->file("additionals.{$index}.image")->getMimeType()]);
                }

                ServiceAdditional::create([
                    'service_id' => $service->id,
                    'additional_type_id' => $additionalTypeId,
                    'name' => $additional['name'],
                    'image_path' => $imagePath,
                    'additional_price' => $additional['additional_price'] ?? 0,
                ]);
            }
        }

        return redirect()->route('services.index')->with('success', 'Layanan berhasil dibuat.');
    }

    public function edit($id)
    {
        $service = Service::with('additionals.additionalType')->findOrFail($id);
        $additionalTypes = AdditionalType::all();
        Log::info('Service data for edit:', [
            'id' => $service->id,
            'service_name' => $service->service_name,
            'description' => $service->description,
            'base_price' => $service->base_price,
            'additionals' => $service->additionals->toArray(),
        ]);
        return Inertia::render('Services/Edit', [
            'service' => $service,
            'additionalTypes' => $additionalTypes,
        ]);
    }

    public function update(Request $request, $id)
    {
        Log::info('Update Service Request Input:', $request->all());
        if ($request->hasFile('additionals.*.image')) {
            $fileDetails = collect($request->file('additionals'))->map(function ($file, $index) {
                return [
                    'index' => $index,
                    'name' => $file['image']->getClientOriginalName(),
                    'size' => $file['image']->getSize(),
                    'mime' => $file['image']->getMimeType(),
                ];
            })->all();
            Log::info('Uploaded files details in update:', $fileDetails);
        }

        $validated = $request->validate([
            'service_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'base_price' => 'required|numeric|min:0',
            'additionals' => 'nullable|array',
            'additionals.*.id' => 'nullable|exists:service_additionals,id',
            'additionals.*.additional_type_id' => 'nullable|exists:additional_types,id',
            'additionals.*.new_type' => 'nullable|string|max:100|unique:additional_types,name',
            'additionals.*.name' => 'required|string|max:255',
            'additionals.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,heic,heif|max:10240',
            'additionals.*.image_path' => 'nullable|string',
            'additionals.*.additional_price' => 'nullable|numeric|min:0',
        ], [
            'additionals.*.image.mimes' => 'Gambar harus berformat JPEG, PNG, JPG, GIF, HEIC, atau HEIF.',
            'additionals.*.image.max' => 'Setiap gambar maksimal 10MB.',
            'additionals.*.new_type.unique' => 'Tipe tambahan sudah ada.',
            'additionals.*.new_type.max' => 'Nama tipe tambahan maksimal 100 karakter.',
        ]);

        Log::info('Validated data:', $validated);

        $service = Service::findOrFail($id);
        $service->update([
            'service_name' => $validated['service_name'],
            'description' => $validated['description'],
            'base_price' => $validated['base_price'],
        ]);

        if ($request->has('additionals')) {
            $existingIds = array_filter(array_column($request->additionals, 'id'));
            $deleted = ServiceAdditional::where('service_id', $service->id)
                ->whereNotIn('id', $existingIds)
                ->get();
            foreach ($deleted as $item) {
                if ($item->image_path && Storage::disk('public')->exists($item->image_path)) {
                    Storage::disk('public')->delete($item->image_path);
                    Log::info('Deleted old image:', ['path' => $item->image_path]);
                }
            }
            $deleted->each->delete();

            foreach ($request->additionals as $index => $additional) {
                $existingAdditional = !empty($additional['id'])
                    ? ServiceAdditional::find($additional['id'])
                    : null;

                $additionalTypeId = $additional['additional_type_id'];
                if (!$additionalTypeId && !empty($additional['new_type'])) {
                    $newType = AdditionalType::firstOrCreate(['name' => $additional['new_type']]);
                    $additionalTypeId = $newType->id;
                    Log::info('Created new AdditionalType:', ['name' => $newType->name, 'id' => $newType->id]);
                }
                if (!$additionalTypeId) {
                    $additionalTypeId = $existingAdditional ? $existingAdditional->additional_type_id : null;
                    if (!$additionalTypeId) {
                        Log::warning('Skipping additional due to null additional_type_id:', ['additional' => $additional]);
                        continue;
                    }
                }

                $imagePath = $additional['image_path'] ?? ($existingAdditional ? $existingAdditional->image_path : null);
                if ($request->hasFile("additionals.{$index}.image")) {
                    if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                        Log::info('Deleted old image:', ['path' => $imagePath]);
                    }
                    $imagePath = $request->file("additionals.{$index}.image")
                        ->store('service_additionals', 'public');
                    Log::info('Stored image:', ['path' => $imagePath, 'mime' => $request->file("additionals.{$index}.image")->getMimeType()]);
                }

                $data = [
                    'service_id' => $service->id,
                    'additional_type_id' => $additionalTypeId,
                    'name' => $additional['name'],
                    'image_path' => $imagePath,
                    'additional_price' => $additional['additional_price'] ?? 0,
                ];

                if ($existingAdditional) {
                    $existingAdditional->update($data);
                } else {
                    ServiceAdditional::create($data);
                }
            }
        } else {
            $deleted = ServiceAdditional::where('service_id', $service->id)->get();
            foreach ($deleted as $item) {
                if ($item->image_path && Storage::disk('public')->exists($item->image_path)) {
                    Storage::disk('public')->delete($item->image_path);
                    Log::info('Deleted old image:', ['path' => $item->image_path]);
                }
            }
            $deleted->each->delete();
        }

        return redirect()->route('services.index')
            ->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $additionals = ServiceAdditional::where('service_id', $id)->get();
        foreach ($additionals as $additional) {
            if ($additional->image_path && Storage::disk('public')->exists($additional->image_path)) {
                Storage::disk('public')->delete($additional->image_path);
                Log::info('Deleted image:', ['path' => $additional->image_path]);
            }
        }
        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Layanan berhasil dihapus.');
    }
}