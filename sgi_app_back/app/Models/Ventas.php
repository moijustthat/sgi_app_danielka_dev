<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;

use App\Lib\ImgProccessor;

class Ventas extends Model
{
    use HasFactory;

    protected $table = 'Ventas';
    protected $primaryKey = 'ventaId';

    protected $fillable = ['clienteId', 'empleadoId', 'fecha', 'fechaLimite', 'mora', 'estado'];

    public $timestamps = false;

    public static function total()
    {
        return HandleDbResponse::handleResponse(function() {
            $total = DB::select('CALL total_ganancias(@total)');
            $totalValue = DB::select('SELECT @total AS total')[0]->total;
            return JsonHelper::jsonResponse(200, ['total' => $totalValue]);
        }, 'Error al generar el gráfico');
    }

    public static function chart() {
        return HandleDbResponse::handleResponse(function() {
            $ventas = DB::select('select id, `Fecha emision`, Pagado from vw_ventas order by `Fecha emision` asc limit 5');
            return JsonHelper::jsonResponse(200, ['ventas'=>$ventas]);
        }, 'Error al generar el gráfico');
    }

    public static function entregar($id) {
        return HandleDbResponse::handleResponse(function() use ($id){
            $orden = DB::select('CALL entregar_venta(?)', [$id]);
            return JsonHelper::jsonResponse(200, ['message'=>'Entrega realizada con exito']);
        }, 'Error al entregar el pedido de la venta');
    }

    public static function getAbonos($id) {
        return HandleDbResponse::handleResponse(function() use ($id) {
            $ventas = DB::select('select * from vw_abonos_venta where `ID venta` = ?', [$id]);
            return JsonHelper::jsonResponse(200, ['abonos'=>$ventas, 'message'=> 'Abonos retribuidos exitosamente']);
        }, 'Error al consultar los abonos');
    }

    public static function abonar($ventaId, $abono) {
        return HandleDbResponse::handleResponse(function() use ($ventaId, $abono){
            $orden = DB::select('CALL pa_abono_venta(?,?)', [$ventaId, $abono]);
            return JsonHelper::jsonResponse(200, ['message'=>'Abono realizado con exito']);
        }, 'Error al abonar a la venta');
    }

    public static function getAllVentas() {
        return HandleDbResponse::handleResponse(function() {
            $ventas = DB::select('select * from vw_ventas');
            return JsonHelper::jsonResponse(200, ['ventas'=>$ventas, 'message'=> 'Ventas retribuidas con exito']);
        }, 'Error al consultar todos las proveedores');
    }

    public static function getVenta($ventaId) {
        return HandleDbResponse::handleResponse(function() use ($ventaId){
            $venta = DB::select('select * from vw_detalles_venta WHERE ventaId = ?', [$ventaId]);
            return JsonHelper::jsonResponse(200, ['venta'=>$venta]);
        }, 'Error al recuperar la venta');
    }

    public static function nueva_venta($cliente, $venta, $detalles, $usuario) {
        return HandleDbResponse::handleResponse(function() use ($cliente, $venta, $detalles, $usuario){
            return DB::transaction(function () use ($cliente, $venta, $detalles, $usuario){
                $clienteId;
                // Verificar si el cliente es nuevo o ya existe
                if ($cliente['id'] == 'new') {
                    // Crear el nuevo cliente
                    $nuevocliente = array();
                    array_push($nuevocliente,
                        $cliente['Nombre'],
                        $cliente['Apellido'],
                        $cliente['Numero RUT'] && $cliente['Numero RUT'] !== '' ? $cliente['Numero RUT'] : NULL,
                        $cliente['Fecha de nacimiento'] && $cliente['Fecha de nacimiento'] !== '' ? $cliente['Fecha de nacimiento'] : NULL,
                        $cliente['Correo'] && $cliente['Correo'] !== '' ? $cliente['Correo'] : NULL,
                        $cliente['Telefono'] && $cliente['Telefono'] !== '' ? $cliente['Telefono'] : NULL,
                        $cliente['Direccion'] && $cliente['Direccion'] !== '' ? $cliente['Direccion'] : NULL,
                    );
                    DB::select('CALL pa_nuevo_cliente(?, ?, ?, ?, ?, ?, ?, @cliente)', $nuevocliente);
                    $clienteId = DB::select('select @cliente as clienteId')[0]->clienteId;
                } else {
                    $clienteId = $cliente['id'];
                }

                // Insertar la nueva venta
                $nuevaVenta = array();
                array_push($nuevaVenta,
                    intval($clienteId),
                    $usuario,
                    $venta['Fecha de pago limite'] && $venta['Fecha de pago limite'] !== '' ? $venta['Fecha de pago limite'] : NULL,
                    $venta['Porcentaje de mora'] && $venta['Porcentaje de mora'] !== '' ? $venta['Porcentaje de mora'] : NULL,
                    'pendiente'
                );

                DB::select('CALL pa_nueva_venta(?, ?, ?, ?, ?, @venta)', $nuevaVenta);
                $ventaId = DB::select('SELECT @venta AS venta')[0]->venta;

                foreach ($detalles as $detalle) {
                    $nuevoDetalle = array();
                    array_push($nuevoDetalle,
                        intval($ventaId),
                        intval($detalle['id']),
                        intval($detalle['Cantidad']),
                        $venta['Fecha de entrega'],
                        floatval($detalle['Precio de venta']),
                        $detalle['Cantidad con descuento'] && $detalle['Cantidad con descuento'] !== '' ? intval($detalle['Cantidad con descuento']) : NULL,
                        $detalle['Porcentaje de descuento'] && $detalle['Porcentaje de descuento'] !== '' ? floatval($detalle['Porcentaje de descuento']) : NULL
                    );
                    DB::select('CALL pa_nuevo_detalle_venta(?,?,?,?,?,?,?)', $nuevoDetalle);
                }   
              $ventaVw = DB::select('SELECT * FROM vw_ventas WHERE id=?', [$ventaId]);
              return JsonHelper::jsonResponse(200, ['venta'=>$ventaVw]);
            });
        }, 'Error al crear la  nueva venta');
    }
}
