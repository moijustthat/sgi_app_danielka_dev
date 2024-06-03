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
            $almacenes = DB::select('select * from vw_almacenes ORDER BY `Prioridad de busqueda` ASC');
            return JsonHelper::jsonResponse(200, ['almacenes'=>$almacenes]);
        }, 'Error al tratar de recuperar los almacenes');
    }

    public static function agregarAlmacen($almacen) {
        return HandleDbResponse::handleResponse(function() use ($almacen) {
            $nuevoAlmacen = array();
            array_push($nuevoAlmacen,
                $almacen['Nombre'],
                intval($almacen['Piso']),
                intval($almacen['Sala']),
                floatval($almacen['Ancho']),
                floatval($almacen['Alto']),
                floatval($almacen['Longitud']),
            );
            DB::select('CALL pa_nuevo_almacen(?, ?, ?, ?, ?, ?, @almacen)', $nuevoAlmacen);
            $almacenId = DB::select('SELECT @almacen AS almacenId')[0]->almacenId;
            return JsonHelper::jsonResponse(200, ['id'=> $almacenId]);
        }, 'Error al querer ingresar un nuevo almacen');
    }

    public static function changePrioridadBusqueda($from, $to) {
        return HandleDbResponse::handleResponse(function() use ($from, $to) {
            DB::select('CALL pa_alternar_prioridad(?, ?)', [$from, $to]);
            return JsonHelper::jsonResponse(200, ['message'=> 'Almacenes alternados con exito']);
        }, 'Hubo un error al tratar de alternar los almacenes');
    }
}
