<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;


class Inventario extends Model
{
    use HasFactory;

    protected $table = 'Inventario';
    protected $primaryKey = 'inventarioId';

    protected $fillable = ['productoId ', 'almacenId ', 'cantidad', 'fecha', 'comprobante ', 'fechaVencimiento', 'hora'];

    public $timestamps = false;

    public static function getAllEntradas() {
        return HandleDbResponse::handleResponse(function() {
            $entradas = DB::select('select * from vw_entradas');
            return JsonHelper::jsonResponse(200, ['entradas'=>$entradas]);
        }, 'Error al traer las entradas');
    }

    public static function nuevaEntrada($entrada) {
        return HandleDbResponse::handleResponse(function () use ($entrada) {
            $nuevoStock = array();
            array_push($nuevoStock,
            $entrada['Producto'],
            $entrada['Almacen'],
            $entrada['Cantidad'],
            $entrada['Comprobante'] && $entrada['Comprobante'] !== '' ? $entrada['Comprobante'] : NULL,
            $entrada['Fecha de vencimiento'] && $entrada['Fecha de vencimiento'] !== '' ? $entrada['Fecha de vencimiento'] : NULL,
        );
        DB::select('CALL pa_nuevo_stock(?,?,?,?,?,@stock)', $nuevoStock);
        $stockId = DB::select('SELECT @stock AS stockId')[0]->stockId;
        return JsonHelper::jsonResponse(200, ['id'=> $stockId]);
        }, 'Error al querer ingresar una nueva entrada');
    }
}
