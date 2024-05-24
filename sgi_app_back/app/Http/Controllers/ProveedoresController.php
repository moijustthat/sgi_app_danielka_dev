<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Proveedores;

class ProveedoresController extends Controller
{
    public function index() {
        return Proveedores::getAllProviders();
    }
    
}
