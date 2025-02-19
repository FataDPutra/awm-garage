<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Tampilkan daftar semua layanan (services).
     */
    public function index(): Response
    {
        $services = Service::all();
        return Inertia::render('Services/Index', [
            'services' => $services
        ]);
    }

    /**
     * Tampilkan halaman tambah layanan.
     */
    public function create(): Response
    {
        return Inertia::render('Services/Create');
    }

    /**
     * Simpan layanan baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'service_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
        ]);

        Service::create([
            'service_name' => $request->service_name,
            'description' => $request->description,
            'base_price' => $request->base_price,
        ]);

        return redirect()->route('services.index')->with('success', 'Layanan berhasil ditambahkan.');
    }

    /**
     * Tampilkan halaman edit layanan.
     */
    public function edit(Service $service): Response
    {
        return Inertia::render('Services/Edit', [
            'service' => $service
        ]);
    }

    /**
     * Update layanan yang ada.
     */
    public function update(Request $request, Service $service)
    {
        $request->validate([
            'service_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
        ]);

        $service->update([
            'service_name' => $request->service_name,
            'description' => $request->description,
            'base_price' => $request->base_price,
        ]);

        return redirect()->route('services.index')->with('success', 'Layanan berhasil diperbarui.');
    }

    /**
     * Hapus layanan dari database.
     */
    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services.index')->with('success', 'Layanan berhasil dihapus.');
    }
}
