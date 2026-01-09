<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class VarifyCertificate extends Controller
{
    public function index() {}
    public function show(Request $uid)
    {
        dd($uid);
        $uid = $request->input('uid');

        // Step 1: Validate UID structure
        $pattern = '/^[A-Z]{3}-[A-Z]{3}-\d{4}-\d{4}-[A-Z]{1}-\d{1,2}$/';

        if (!preg_match($pattern, $uid)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid UID format.',
            ], 422);
        }

        // Step 2: Search only if format matches
        $student = Student::where('uid', $uid)->first();

        if (!$student) {
            return response()->json([
                'status' => false,
                'message' => 'Student not found.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $student,
        ]);
    }
}
