<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Ordenes;

class OrdenesController extends Controller
{

    public function indexOrdenes() {
        return Ordenes::getAllOrdenes();
    }

    public function indexOrden($ordenId) {
        return Ordenes::getOrden($ordenId);
    }

    public function insert_orden(Request $request) {
        // Validar tipos de la peticion
        $proveedor = $request['proveedor']; // Object
        $orden = $request['orden']; // Object
        $detalles = $request['detalles']; // Object
        $usuario = $request['usuario']; // Int

        return Ordenes::nueva_orden($proveedor, $orden, $detalles, $usuario);
    }

    public function abonoOrden(Request $request) {
        $ordenId = $request['facturaId'];
        $abono = floatVal($request['abono']);
        Ordenes::abonar($ordenId, $abono);
    }
}
