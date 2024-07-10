<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Ventas;

class VentasController extends Controller
{

    public function total() {
        return Ventas::total();
    }

    public function chart() {
        return Ventas::chart();
    }

    public function indexVentas() {
        return Ventas::getAllVentas();
    }

    public function indexVenta($ventaId) {
        return Ventas::getVenta($ventaId);
    }

    public function abonosVenta($id) {
        return Ventas::getAbonos($id);
    }

    public function abonoVenta(Request $request) {
        $ventaId = $request['facturaId'];
        $abono = floatVal($request['abono']);
        return Ventas::abonar($ventaId, $abono);
    }

    public function entregaVenta(Request $request) {
        $id = $request['id'];
        return Ventas::entregar($id);
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
