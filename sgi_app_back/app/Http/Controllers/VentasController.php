<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Ventas;

class VentasController extends Controller
{

    public function indexVentas() {
        return Ventas::getAllVentas();
    }

    public function indexVenta($ventaId) {
        Ventas::getVenta($ventaId);
    }

    public function insert_venta(Request $request) {
        // Validar tipos de la peticion
        $cliente = $request['cliente']; // Object
        $venta = $request['venta']; // Object
        $detalles = $request['detalles']; // Object
        $usuario = $request['usuario']; // Int

        return Ventas::nueva_venta($cliente, $venta, $detalles, $usuario);
    }
}
