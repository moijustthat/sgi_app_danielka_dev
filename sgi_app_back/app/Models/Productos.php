<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;

use App\Lib\ImgProccessor;

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
            $disabledProducts = array(); // Productos que estan desactivados y vienen de nuevo en la peticion por su nombre o codigo de barra
            /* 
                Si ya existe un producto con el nombre o codigo de barra en la bd y este esta desactivado 
                y el cliente lo mando en la peticion, entonces mandar una respuesta(despues de guardar el resto de nuevos productos)
                indicando que se encontraron productos con los mismo datos en la bd pero que estan desactivados y si este
                quiere restituir estos productos o crear productos nuevos(sin que el codigo de barra y nombre sean igual a otro producto en la tabla Productos)
            */
            foreach ($products as $product) {
                $rollback = false;
                $countNew = 0;
                // Validar si el nombre o codigo de barra ya existe en la base de datos
                $name = $product['Nombre'];
                $barCode =  $product['Codigo de barra'] == "null" ? NULL : $product['Codigo de barra'];

                $disabledProductByName = DB::select('select productoId, nombre, descripcion, codigoBarra, img from Productos where nombre = ?', [$name]);
                $disabledProductByBarCode = DB::select('select productoId, nombre, descripcion, codigoBarra, img from Productos where codigoBarra = ?', [$barCode]);

                // Verificar que exista un producto con el nombre y codigo de barra iguales al de la peticion
                if ($disabledProductByName && $disabledProductByBarCode) {
                    if ($disabledProductByBarCode[0]->productoId === $disabledProductByName[0]->productoId ) {
                        array_push($disabledProducts, ['producto'=>$disabledProductByName, 'type'=>'both']);
                        $rollback = true;
                    } 
                } else {
                    if($disabledProductByName) {
                        array_push($disabledProducts, ['producto'=>$disabledProductByName, 'type'=>'name']);
                        $rollback = true;
                    }

                    if ($disabledProductByBarCode) {
                        array_push($disabledProducts, ['producto'=>$disabledProductByBarCode, 'type'=>'bar_code']);
                        $rollback = true;
                    }
                }

                
                if ($rollback) {
                    continue;
                }

                $params = array();
                array_push($params,
                        $name,
                        $product['Descripcion'],
                        floatval($product['Precio de venta']),
                        $product['Estado'],
                        $product['Caducidad'],
                        $barCode,
                        intval($product['Minimo']),
                        intval($product['Maximo']),
                        $product['Imagen'] == "null" ? NULL : ImgProccessor::binToHex($product['Imagen']),
                        intval($product['Categoria']),
                        intval($product['Marca']),
                        intval($product['Unidad de medida']),
                        $product['Metodo'],
                        $product['Cantidad'] == "null" ? NULL : intval($product['Cantidad']),
                        intval($product['Almacen']),
                        $product['comprobante'] == "null" ? NULL : $product['comprobante'],
                        $product['Fecha de vencimiento'] == "null" ? NULL : $product['Fecha de vencimiento'],
                );
                DB::statement('CALL pa_nuevo_producto(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', $params);     
                $countNew++;  
            }
            return JsonHelper::jsonResponse(200, ['data'=> 'Transaccion Exitosa', 'count'=>$countNew, 'found'=>$disabledProducts]);
        }, 'Error al guardar los productos');
    }

    public static function actualizar($id, $payload) {
        return HandleDbResponse::handleResponse(function() use ($id, $payload) {
            foreach ($payload as $field => $value) {
                // Construir consulta dinamicamente(No se pueden usar parametros para las columnas)
                $sql = sprintf('UPDATE Productos SET %s = ? WHERE productoId = ?', $field);
                if ($field === 'img') {
                    if (!preg_match('/^0x[0-9A-Fa-f]+$/', $value)) {
                        $value = ImgProccessor::binToHex($value);
                    }  
                }
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
