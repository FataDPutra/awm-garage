<?php

namespace App\Http\Controllers;

use App\Models\AdditionalType;
use Illuminate\Http\Request;

class AdditionalTypeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:additional_types,name',
        ]);

        $additionalType = AdditionalType::create([
            'name' => $request->name,
        ]);

        return response()->json(['id' => $additionalType->id, 'name' => $additionalType->name], 201);
    }
}