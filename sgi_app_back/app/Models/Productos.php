<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\ImgProccessor;
use App\Lib\HandleDbResponse;

use Exception;

class Productos extends Model
{
    use HasFactory;

    protected $table = 'Productos';
    protected $primaryKey = 'productoId';

    protected $fillable = ['nombre', 'descripcion', 'precio', 'activo', 'perecedero', 'codigoBarra', 'minimo',
        'maximo', 'img', 'categoriaId', 'marcaId', 'unidadMedidaId', 'metodo' 
    ];

    public $timestamps = false;

    // Peticiones con procedientos almacenados(esto no se ve en los tutoriales de youtube)

    public static function getAllProducts() {
        return HandleDbResponse::handleResponse(function() {
            $products = DB::select('select * from vw_productos where Estado = "t";');
            return JsonHelper::jsonResponse(200, ['data'=>$products, 'message'=> 'Productos retribuidos con exito']);
        }, 'Error al consultar todos los productos');
    }

    public static function desactivate($productsIds) {
        return HandleDbResponse::handleResponse(function() use ($productsIds){
            foreach ($productsIds as $id) {
                DB::select('UPDATE Productos SET activo = "f" WHERE productoId = ?', [$id]);
            }
            return JsonHelper::jsonResponse(200, ['data'=> 'Productos desactivados correctamente']);
        }, 'Error al desabilitar los productos');
    }

    // Por alguna razon aqui no sirvio la transaccion. Esperemos Sergio lo arregle
    public static function saveNewProducts($products) {
        return HandleDbResponse::handleResponse(function() use ($products){
            foreach ($products as $product) {
                $params = array();
                array_push($params,
                        $product['nombre'],
                        $product['descripcion'],
                        floatval($product['precio']),
                        $product['activo'],
                        $product['perecedero'],
                        $product['codigoBarra'] == "null" ? NULL : $product['codigoBarra'],
                        intval($product['minimo']),
                        intval($product['maximo']),
                        $product['img'] == "null" ? NULL : ImgProccessor::binToHex($product['img']),
                        intval($product['categoria']),
                        intval($product['marca']),
                        intval($product['medida']),
                        $product['metodo'],
                        intval($product['cantidad']),
                        intval($product['almacen']),
                        $product['comprobante'] == "null" ? NULL : $product['comprobante'],
                        $product['fechaVencimiento'] == "null" ? NULL : $product['fechaVencimiento'],
                        $product['descripcionEstacional'] == "null" ? NULL : $product['descripcionEstacional'],
                        $product['fechaInicioEstacional'] == "null" ? NULL : $product['fechaInicioEstacional'],
                        $product['fechaFinalEstacional'] == "null" ? NULL : $product['fechaFinalEstacional'],
                );
                DB::statement('CALL pa_nuevo_producto(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', $params);       
            }
            return JsonHelper::jsonResponse(200, ['data'=> 'Transaccion Exitosa']);
        }, 'Error al guardar los productos');
    }

    public static function actualizar($id, $payload) {
        return HandleDbResponse::handleResponse(function() use ($id, $payload) {
            foreach ($payload as $field => $value) {
                // Construir consulta dinamicamente(No se pueden usar parametros para las columnas)
                $sql = sprintf('UPDATE Productos SET %s = ? WHERE productoId = ?', $field);
                DB::statement($sql, [$value, $id]);
            }
            return JsonHelper::jsonResponse(200, ['data'=> 'Producto actualizado con exito']);
        }, 'Error al actualizar el producto: '.$id);
    }

    public static function get_items_for_products() {
        return HandleDbResponse::handleResponse(function() {
            return DB::transaction(function () {
                // Traer esos datos que van en las tablas y formularios donde aparecen los productos
                $categorias = DB::select('select * from categorias');
                $marcas = DB::select('select * from marcas');
                $unidades_medida = DB::select('select * from unidades_medida');
                $almacenes = DB::select('select * from almacenes');

                // Agrupamiento de respuestas
                $data = [
                    'categorias' => $categorias,
                    'marcas' => $marcas,
                    'unidades_medida' => $unidades_medida,
                    'almacenes' => $almacenes
                ];

                return $data;
            });
        }, 'Error al obtener los items para los productos');
    }
}
