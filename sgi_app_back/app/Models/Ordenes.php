<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;

use App\Lib\ImgProccessor;

class Ordenes extends Model
{
    use HasFactory;

    protected $table = 'Ordenes';
    protected $primaryKey = 'ordenId';

    protected $fillable = ['ordenId ', 'proveedorId', 'empleadoId', 'fecha', 'fechaLimite', 'mora', 'estado'];

    public $timestamps = false;

    public static function getAllOrdenes() {
        return HandleDbResponse::handleResponse(function() {
            $ordenes = DB::select('select * from vw_ordenes');
            return JsonHelper::jsonResponse(200, ['ordenes'=>$ordenes, 'message'=> 'Ordenes retribuidas con exito']);
        }, 'Error al consultar todos las proveedores');
    }

    public static function nueva_orden($proveedor, $orden, $detalles, $usuario) {
        return HandleDbResponse::handleResponse(function() use ($proveedor, $orden, $detalles, $usuario){
            return DB::transaction(function () use ($proveedor, $orden, $detalles, $usuario){
                $proveedorId;
                // Verificar si el proveedor es nuevo o ya existe
                if ($proveedor['id'] == 'new') {
                    // Crear el nuevo proveedor
                    $nuevoProveedor = array();
                    array_push($nuevoProveedor,
                        $proveedor['Razon social'],
                        $proveedor['Numero RUT'] && $proveedor['Numero RUT'] !== '' ? $proveedor['Numero RUT'] : NULL,
                        $proveedor['Correo'] && $proveedor['Correo'] !== '' ? $proveedor['Correo'] : NULL,
                        $proveedor['Telefono'],
                        $proveedor['Direccion'],
                        't'
                    );
                    DB::select('CALL pa_nuevo_proveedor(?, ?, ?, ?, ?, ?, @proveedor)', $nuevoProveedor);
                    $proveedorId = DB::select('select @proveedor as proveedorId')[0]->proveedorId;
                } else {
                    $proveedorId = $proveedor['id'];
                }

                // Insertar la nueva orden
                $nuevaOrden = array();
                array_push($nuevaOrden,
                    intval($proveedorId),
                    $usuario,
                    $orden['Fecha de pago limite'] && $orden['Fecha de pago limite'] !== '' ? $orden['Fecha de pago limite'] : NULL,
                    $orden['Porcentaje de mora'] && $orden['Porcentaje de mora'] !== '' ? $orden['Porcentaje de mora'] : NULL          
                );

                DB::select('CALL pa_nueva_orden(?, ?, ?, ?, @orden)', $nuevaOrden);
                $ordenId = DB::select('SELECT @orden AS orden')[0]->orden;

                foreach ($detalles as $detalle) {
                    $nuevoProducto = array();
                    if (preg_match('/^new/', $detalle['id'])) { // Si es un nuevo producto
                        array_push($nuevoProducto,
                            $detalle['Nombre'],
                            $detalle['Descripcion'],
                            $detalle['Precio de venta'],
                            't',
                            $detalle['Caducidad'],
                            $detalle['Codigo de barra'] && $detalle['Codigo de barra'] !== '' ? $detalle['Codigo de barra'] : NULL,
                            $detalle['Minimo'],
                            $detalle['Maximo'],
                            $detalle['Imagen'] && $detalle['Imagen'] !== '' ? ImgProccessor::binToHex($detalle['Imagen']) : NULL,
                            $detalle['Categoria'],
                            $detalle['Marca'],
                            $detalle['Unidad de medida'],
                            $detalle['Metodo']
                        );
                        DB::select('CALL pa_producto(?,?,?,?,?,?,?,?,?,?,?,?,?, @producto)', $nuevoProducto);
                        $productoId = DB::select('select @producto as productoId')[0]->productoId;
                    } else {
                        $productoId = $detalle['id'];
                    }
                    $nuevoDetalle = array();
                    array_push($nuevoDetalle,
                        intval($ordenId),
                        intval($productoId),
                        intval($detalle['Cantidad']),
                        $orden['Fecha de entrega'],
                        floatval($detalle['Precio de compra']),
                        $detalle['Cantidad con descuento'] && $detalle['Cantidad con descuento'] !== '' ? intval($detalle['Cantidad con descuento']) : NULL,
                        $detalle['Porcentaje de descuento'] && $detalle['Porcentaje de descuento'] !== '' ? floatval($detalle['Porcentaje de descuento']) : NULL
                    );
                    DB::select('CALL pa_nuevo_detalle_orden(?,?,?,?,?,?,?)', $nuevoDetalle);
                }   
                
            });
        }, 'Error al crear la  nueva orden');
    }
}
