<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
public function edit(Request $request): Response
{
    return Inertia::render('Profile/Edit', [
        'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        'status' => session('status'),
        'user' => $request->user(), // Tambahkan user agar tersedia di frontend
    ]);
}


    /**
     * Update the user's profile information.
     */
    // public function update(ProfileUpdateRequest $request): RedirectResponse
    // {
    //     $request->user()->fill($request->validated());

    //     if ($request->user()->isDirty('email')) {
    //         $request->user()->email_verified_at = null;
    //     }

    //     $request->user()->save();

    //     return Redirect::route('profile.edit');
    // }

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
        ]);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
