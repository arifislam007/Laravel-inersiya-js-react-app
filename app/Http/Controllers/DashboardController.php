<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        $totalStudetn = Student::Count();
        $totalBatch= Batch::Count();
        $totalCourses = Course::Count();
        return Inertia::render('dashboard',[
            'totalStudent'=> $totalStudetn,
            'totalBatchs'=>$totalBatch,
            'totalCourses'=>$totalCourses
        ]);
    }
}
