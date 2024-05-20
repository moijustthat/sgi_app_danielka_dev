<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
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
    // Por alguna razon aqui no sirvio la transaccion. Esperemos Sergio lo arregle
    public static function saveNewProducts($products) {
            try {  
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
            } catch(Exception $e) {
                $fullErrorMessage = $e->getMessage();

                // Extraer solo el mensaje que entiende el usuario(y yo tambien XD)
                $pattern = '/SQLSTATE\[45000\]: <<Unknown error>>: \d+ (.+?) \(Connection: mysql,/';
                $matches = [];
            
                if (preg_match($pattern, $fullErrorMessage, $matches)) {
                    // Si se encuentra el patron usarlo como respuesta de error
                    $errorMessage = $matches[1];
                } else {
                    // Si no se encuentra el patron, aguas que se manda algo que ni yo se leer
                    $errorMessage = $fullErrorMessage;
                }
                return JsonHelper::jsonResponse(500, ['messageError'=> $errorMessage]);
            }

    }

    public static function get_items_for_products() {
        try {
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
        } catch(Exception $e) {
            return JsonHelper::jsonResponse(500, ['messageError' => 'Error al realizar la transaccion para los items del producto']);
        }
    }
}
