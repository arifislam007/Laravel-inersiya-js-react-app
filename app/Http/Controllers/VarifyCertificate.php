<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VarifyCertificate extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', [
            'status' => null,
            'message' => null,
            'data' => null,
        ]);
    }
    public function show(Request $request)
    {
        try {
            $validated = $request->validate([
                'uid' => [
                    'required',
                    'string',
                    'regex:/^SDC-[A-Z]{2,5}-\d{4}-\d{4}-[A-Z]-\d+$/'
                ],
            ]);

            $student = Student::query()
                ->where('student_uid', $validated['uid'])
                ->first();

            if (!$student) {
                return response()->json([
                    'status' => false,
                    'message' => 'Certificate not found',
                    'data' => null,
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Certificate found',
                'data' => [
                    'name'        => $student->name,
                    'course'      => $student->course->title ?? null,
                    'issued_at'   => $student->created_at->toDateString(),
                    'certificate' => $student->student_uid,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => $e->validator->errors()->first('uid'),
                'data' => null,
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Please try again.',
                'data' => null,
            ], 500);
        }
    }
}
