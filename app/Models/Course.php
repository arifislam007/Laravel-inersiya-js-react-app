<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
   
    protected $fillable = [
        'name',
        'course_code',
        'description',
    ];
    
    public function students()
    {
        return $this->belongsToMany(Student::class);
    }
    public function batch()
    {
        return $this->hasMany(Batch::class, 'course_id', 'id');
    }
}
