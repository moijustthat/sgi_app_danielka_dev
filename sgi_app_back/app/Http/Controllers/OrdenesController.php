<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Ordenes;

class OrdenesController extends Controller
{
    public function insert_orden(Request $request) {
        // Validar tipos de la peticion
        $proveedor = $request['proveedor']; // Object
        $producto = $request['producto']; // Object
        $detalles = $request['detalles']; // Object

        Ordenes::nueva_orden($proveedor, $producto, $orden, $detalles);
    }
}
