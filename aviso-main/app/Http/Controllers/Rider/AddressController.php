<?php

namespace App\Http\Controllers\Rider;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Yajra\Address\Entities\Barangay;
use Yajra\Address\Entities\City;
use Yajra\Address\Entities\Province;

class AddressController extends Controller
{
    public function provinces(): JsonResponse
    {
        $provinces = Province::orderBy('name')
            ->get(['province_id', 'name', 'region_id']);

        return response()->json($provinces);
    }

    public function cities(string $province): JsonResponse
    {
        $cities = City::where('province_id', $province)
            ->orderBy('name')
            ->get(['city_id', 'name']);

        return response()->json($cities);
    }

    public function barangays(string $city): JsonResponse
    {
        $barangays = Barangay::where('city_id', $city)
            ->orderBy('name')
            ->get(['code', 'name']);

        return response()->json($barangays);
    }
}
