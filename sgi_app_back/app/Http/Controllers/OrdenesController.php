<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Ordenes;
use App\Lib\JsonHelper;

class OrdenesController extends Controller
{

    public function indexOrdenes() {
        return Ordenes::getAllOrdenes();
    }

    public function indexOrden($ordenId) {
        return Ordenes::getOrden($ordenId);
    }

    public function ordenesRecientes() {
        return Ordenes::getOrdenesRecientes();
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

    public function cancelarOrden(Request $request) {
        $ordenId = $request['id'];

        try {
            // Buscar el usuario (cargo tiene que ser diferente a cliente(14))
            $orden = Ordenes::where('ordenId', $ordenId)
            ->firstOrFail();

            // verificar si existe algun empleado con el email dado
            if (is_null($orden)) {
                return JsonHelper::jsonResponse(400, ['error' => 'Orden: ' . $request->ordenId . ' no existe en la base de datos']);
            }

            $orden->update([
                'estado' => 'cancelada'
            ]);

            return JsonHelper::jsonResponse(200, ['message' => 'Orden cancelada con exito']);

        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error del servidor al cancelar la orden' . $e->getMessage()]);
        }
    }

    public function activarOrden(Request $request) {
        $ordenId = $request['id'];

        try {
            // Buscar el usuario (cargo tiene que ser diferente a cliente(14))
            $orden = Ordenes::where('ordenId', $ordenId)
            ->firstOrFail();

            // verificar si existe algun empleado con el email dado
            if (is_null($orden)) {
                return JsonHelper::jsonResponse(400, ['error' => 'Orden: ' . $request->ordenId . ' no existe en la base de datos']);
            }

            $orden->update([
                'estado' => 'pendiente'
            ]);

            return JsonHelper::jsonResponse(200, ['message' => 'Orden activada con exito']);

        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error del servidor al cancelar la orden' . $e->getMessage()]);
        }
    }

    public function abonosOrden($id) {
        return Ordenes::getAllAbonos($id);
    }
}
