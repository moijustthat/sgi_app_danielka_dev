<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;


class Almacenes extends Model
{
    use HasFactory;

    protected $table = 'Almacenes';
    protected $primaryKey = 'almacenId';

    protected $fillable = ['nombre', 'piso', 'sala', 'ancho', 'alto', 'longitud', 'activo'];

    public $timestamps = false;

    public static function getAllAlmacenes() {
        return HandleDbResponse::handleResponse(function() {
            $almacenes = DB::select('select * from vw_almacenes');
            return JsonHelper::jsonResponse(200, ['almacenes'=>$almacenes]);
        }, 'Error al tratar de recuperar los almacenes');
    }

    public static function agregarAlmacen($almacen) {
        return HandleDbResponse::handleResponse(function() use ($almacen) {
            return JsonHelper::jsonResponse(200, ['data'=>$almacen]); // Ver que devuelve almacen
        }, 'Error al queres ingresar un nuevo almacen');
    }
}
