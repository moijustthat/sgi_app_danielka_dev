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

    public static function agregar_nuevo_producto($input) {
        try {
            return DB::select('CALL pa_nuevo_producto(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', $input);
        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error al querer ingresar el nuevo producto' . $e]);
        }
    }
}
