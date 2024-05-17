<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;

class Productos extends Model
{
    use HasFactory;

    protected $table = 'Productos';
    protected $primaryKey = 'productoId';

    protected $fillable = ['nombre', 'descripcion', 'precio', 'activo', 'perecedero', 'codigoBarra', 'minimo',
        'maximo', 'img', 'categoriaId', 'marcaId', 'unidadMedidaId', 'metodo' 
    ];

    public $timestamps = false;

    // Stored procedures
    public static function agregar_nuevo_producto($input) {
        try {
            return DB::select('CALL pa_nuevo_producto(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', $input);
        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error al querer ingresar el nuevo producto' . $e]);
        }
    }

    public static function get_items_for_products() {
        try {
            return DB::transaction(function () {
                $categorias = DB::select('select * from categorias');
                $marcas = DB::select('select * from marcas');
                $unidades_medida = DB::select('select * from unidades_medida');
                $almacenes = DB::select('select * from almacenes');

                // Agrupamiento
                $data = [
                    'categorias' => $categorias,
                    'marcas' => $marcas,
                    'unidades_medida' => $unidades_medida,
                    'almacenes' => $almacenes
                ];

                return $data;
            });
        } catch(\Exception $e) {
            return JsonResponse::jsonResponse(500, ['error' => 'Error al realizar la transaccion para los items del producto']);
        }
    }
}
