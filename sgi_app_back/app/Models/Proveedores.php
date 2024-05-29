<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;

class Proveedores extends Model
{
    use HasFactory;

    protected $table = 'Proveedores';
    protected $primaryKey = 'proveedorId';

    protected $fillable = ['razonSocial', 'rut', 'correo', 'direccion', 'activo'];

    public $timestamps = false;

    public static function getAllProviders() {
        return HandleDbResponse::handleResponse(function() {
            $proveedores = DB::select('select * from vw_proveedores where Estado = "t";');
            return JsonHelper::jsonResponse(200, ['data'=>$proveedores, 'message'=> 'Productos retribuidos con exito']);
        }, 'Error al consultar todos los proveedores');
    }

    public static function nuevoProveedor($proveedor) {
        return HandleDbResponse::handleResponse(function () use ($proveedor) {
            $nuevoProveedor = array();
            array_push($nuevoProveedor,
                $proveedor['Razon Social'],
                $proveedor['Numero RUT'],
                $proveedor['Correo'],
                $proveedor['Telefono'],
                $proveedor['Direccion'],
                $proveedor['activo'],
            );
            DB::select('CALL pa_nuevo_proveedor(?,?,?,?,?,?,@proveedor)', $nuevoProveedor);
            $proveedorId = DB::select('SELECT @proveedor AS proveedor')[0]->proveedor; 
            return JsonHelper::jsonResponse(200, ['id'=>$proveedorId]);
        }, "Error al tratar de ingresar un proveedor");
    }
}
