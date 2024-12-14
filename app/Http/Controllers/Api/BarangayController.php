<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Barangay;

class BarangayController extends Controller
{
    //
    public function index()
    {
        //return all barangay and count the # of farmers and lands
        $barangays = Barangay::withCount(['farmers', 'lands'])->get();
        return response()->json($barangays);
    }

    public function get_list_of_farmers(int $barangay_id)
    {
        $farmers = Barangay::find($barangay_id)->farmers;
        return response()->json($farmers);
    }
}
