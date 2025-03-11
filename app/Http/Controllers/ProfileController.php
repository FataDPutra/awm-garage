<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
public function edit(Request $request): Response
{
    return Inertia::render('Profile/Edit', [
        'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        'status' => session('status'),
        'user' => $request->user()->fresh(), // Pastikan data user selalu terbaru
        'flash' => [
            'message' => session('message'),
        ],
    ]);
}

public function update(Request $request)
{
    $user = Auth::user();

    $request->validate([
        'username' => 'required|string|max:50|unique:users,username,' . $user->id,
        'full_name' => 'nullable|string|max:100',
        'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string',
        'province_name' => 'nullable|string',
        'city_name' => 'nullable|string',
        'district_name' => 'nullable|string',
        'subdistrict_name' => 'nullable|string',
        'zip_code' => 'nullable|string',
        'address_details' => 'nullable|string',
        'latitude' => 'nullable|numeric|between:-90,90',
        'longitude' => 'nullable|numeric|between:-180,180',
        'password' => 'nullable|min:6|confirmed',
    ]);

    // Cek apakah nomor telepon diubah
    if ($request->phone !== $user->phone) {
        $user->phone_verified_at = null;
    }

    $user->update([
        'username' => $request->username,
        'full_name' => $request->full_name,
        'email' => $request->email,
        'phone' => $request->phone,
        'address' => $request->address,
        'province_name' => $request->province_name,
        'city_name' => $request->city_name,
        'district_name' => $request->district_name,
        'subdistrict_name' => $request->subdistrict_name,
        'zip_code' => $request->zip_code,
        'address_details' => $request->address_details,
        'latitude' => $request->latitude,
        'longitude' => $request->longitude,
        'password' => $request->password ? Hash::make($request->password) : $user->password,
        'phone_verified_at' => $user->phone_verified_at, // Pastikan nilai ini diupdate
    ]);

    return back()->with('success', 'Profile updated successfully.');
}

    public function sendOtp(Request $request)
    {
        $user = $request->user();
        $phone = $request->input('phone');

        if (!$phone) {
            return back()->withErrors(['phone' => 'Nomor telepon belum diisi.']);
        }

        $otpCode = rand(100000, 999999);
        $expiresAt = now()->addMinutes(10);

        Otp::updateOrCreate(
            ['user_id' => $user->id, 'phone' => $phone],
            ['code' => $otpCode, 'expires_at' => $expiresAt]
        );

        $userkey = env('ZENZIVA_USERKEY');
        $passkey = env('ZENZIVA_PASSKEY');
        $message = "Halo {$user->full_name}, kode OTP Anda adalah: {$otpCode}. Berlaku 10 menit.";
        $url = 'https://console.zenziva.net/wareguler/api/sendWA/';

        $response = Http::asForm()->post($url, [
            'userkey' => $userkey,
            'passkey' => $passkey,
            'to' => $phone,
            'message' => $message,
        ]);

        $result = $response->json();

        if ($result && $result['status'] == '1') {
            return back()->with('message', 'Kode OTP telah dikirim ke nomor WhatsApp Anda. Silakan periksa pesan Anda.');
        } else {
            return back()->withErrors(['phone' => 'Gagal mengirim OTP. Pastikan nomor Anda benar dan terhubung ke WhatsApp.']);
        }
    }

    public function verifyOtp(Request $request)
{
    $user = $request->user();
    $phone = $request->input('phone');
    $otpCode = $request->input('otp');

    $request->validate([
        'phone' => 'required|string|max:20',
        'otp' => 'required|string|size:6',
    ]);

    // Log input untuk debugging
    \Log::info('Verify OTP Attempt', [
        'user_id' => $user->id,
        'phone' => $phone,
        'otp_input' => $otpCode,
    ]);

    $otp = Otp::where('user_id', $user->id)
              ->where('phone', $phone)
              ->where('code', $otpCode)
              ->where('expires_at', '>=', now())
              ->first();

    if ($otp) {
        $user->update(['phone_verified_at' => now()]);
        $otp->delete();
        \Log::info('OTP Verified Successfully', ['user_id' => $user->id]);

        // Kembalikan data user yang diperbarui ke frontend
        return back()->with([
            'message' => 'Nomor telepon Anda telah berhasil diverifikasi untuk notifikasi WhatsApp.',
            'user' => $user->fresh(), // Ambil data terbaru dari database
        ]);
    } else {
        \Log::warning('OTP Verification Failed', [
            'user_id' => $user->id,
            'phone' => $phone,
            'otp_input' => $otpCode,
            'existing_otp' => Otp::where('user_id', $user->id)->where('phone', $phone)->first(),
        ]);
        return back()->withErrors(['otp' => 'Kode OTP salah atau telah kedaluwarsa. Silakan coba lagi.']);
    }
}

    public function destroy(Request $request)
    {
        $request->validate(['password' => ['required', 'current_password']]);
        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Redirect::to('/');
    }
}