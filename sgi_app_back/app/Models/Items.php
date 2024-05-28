<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;

class Items extends Model
{
    use HasFactory;

    protected $table = 'Tipos_Instancia';
    protected $primaryKey = 'tipo_instanciaId';

    protected $fillable = ['valor', 'tipoId'];

    public $timestamps = false;

    public static function getAllCargos() {
        return HandleDbResponse::handleResponse(function() {
            $cargos = DB::select('SELECT * FROM cargos WHERE cargoId != 14');
            return JsonHelper::jsonResponse(200, ['data'=>$cargos]);
        }, 'Error al traer los cargos');
    }

    public static function new_categoria($categoria) {
        return HandleDbResponse::handleResponse(function() use ($categoria){
            $new = DB::statement('CALL pa_nueva_categoria(?, @label, @value)', [$categoria]);
            $val = DB::select('SELECT @value AS val');
            $label = DB::select('SELECT @label AS label');
            return JsonHelper::jsonResponse(200, ['data' => ['value'=>$val[0], 'label'=>$label[0]]]);
        }, 'Error al crear la categoria: '.$categoria);
    } 

    public static function new_marca($marca) {
        return HandleDbResponse::handleResponse(function() use ($marca){
            $new = DB::statement('CALL pa_nueva_marca(?, @label, @value)', [$marca]);
            $val = DB::select('SELECT @value AS val');
            $label = DB::select('SELECT @label AS label');
            return JsonHelper::jsonResponse(200, ['data' => ['value'=>$val[0], 'label'=>$label[0]]]);
        }, 'Error al crear la marca: '.$marca);
    } 

    public static function new_unidad_medida($unidad_medida) {
        return HandleDbResponse::handleResponse(function() use ($unidad_medida){
            $new = DB::statement('CALL pa_nueva_medida(?, @label, @value)', [$unidad_medida]);
            $val = DB::select('SELECT @value AS val');
            $label = DB::select('SELECT @label AS label');
            return JsonHelper::jsonResponse(200, ['data' => ['value'=>$val[0], 'label'=>$label[0]]]);
        }, 'Error al crear la unidad de medida: '.$unidad_medida);
    }
}
