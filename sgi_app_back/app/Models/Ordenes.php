<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;

class Ordenes extends Model
{
    use HasFactory;

    protected $table = 'Ordenes';
    protected $primaryKey = 'ordenId';

    protected $fillable = ['ordenId ', 'proveedorId', 'empleadoId', 'fecha', 'fechaLimite', 'mora', 'estado'];

    public $timestamps = false;

    public static function nueva_orden($proveedor, $producto, $orden, $detalles) {
        return JsonHelper::jsonResponse(200, ['proveedor'=>$proveedor, 'producto'=>$producto, 'orden'=>$orden, 'detalles'=>$detalles]);
        /*return HandleDbResponse::handleResponse(function() use ($proveedor, $producto, $orden, $detalles){
            return DB::transaction(function () use ($proveedor, $producto, $orden, $detalles){
                $proveedorId;
                $productoId;
                $ordenId;
                if ($proveedor['id'] == 'new') {
                    // Crear el nuevo proveedor
                    DB::select('CALL pa_nuevo_proveedor(?, ?, ?, ?, ?, @proveedor)');
                    $proveedorId = DB::select('select @proveedor as proveedorId');
                } else {
                    $proveedorId = $proveedor['id'];
                }

                if ($producto['id'] == 'new') {
                    // Crear el nuevo produc$producto
                    DB::select('CALL pa_nuevo_producto(?, ?, ?, ?, ?, @producto)');
                    $productoId = DB::select('SELECT @producto as productoId');
                } else {
                    $productoId = $producto['id'];
                }

                // Insertar la nueva orden

                DB::select('CALL pa_nuava_orden(?, ?, ?, ?, ?, @orden)');
                $ordenId = DB::select('SELECT @orden AS orden');
                foreach ($detalles as $key => $value) {
                    // Convertir tipos a los indicados en la base de datos
                    // Insertar registro por registro
                }   
                
            });
        }, 'Error al crear la  nueva orden');*/
    }
}
