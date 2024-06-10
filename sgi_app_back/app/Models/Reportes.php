<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;

use App\Lib\ImgProccessor;


class Reportes extends Model
{
    public static function getFinancialResume() {
        return HandleDbResponse::handleResponse(function() {
            $totalOrdenes = DB::select('select * from vw_total_ordenes_8am_a_5pm')[0];
            $totalVentas = DB::select('select * from vw_total_ventas_8am_a_5pm')[0];
            return JsonHelper::jsonResponse(200, ['totales'=>['ordenes'=>$totalOrdenes, 'ventas'=>$totalVentas]]);
        }, 'Error al recuperar el total financiero de ordenes(ultimas 24 horas)');
    }
}
