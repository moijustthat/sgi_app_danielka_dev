<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Proveedores;

class ProveedoresController extends Controller
{
    public function index() {
        return Proveedores::getAllProviders();
    }

    public function insert_proveedor(Request $request) {
        $proveedor = $request['proveedor'];
        return Proveedores::nuevoProveedor($proveedor);
    }
    
}
