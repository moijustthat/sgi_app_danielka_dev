<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Productos;
use App\Lib\JsonHelper;

class ProductosController extends Controller
{
    public function agregarProducto(Request $request) {

        $required = ['nombre', 'descripcion', 'precio', 'activo', 'perecedero', 'codigoBarra', 'minimo', 'maximo','img','categoriaId', 'marcaId', 'unidadMedidaId','metodo', 'cantidad','almacenId','comprobante','fechaVencimiento','descripcionEstacion','fechaInicioEstacion','fechaFinalEstacion'];
        
        // Comprobar llegada de todos los campos
        
        $input = array($request->input('nombre'));

        try {
            return JsonHelper::jsonResponse(200, ['data' => $input]);
        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error al agregar el nuevo producto '.$e]);
        }
    }

    public function getItemsSeleccionables() {
        try {
            return Productos::get_items_for_products();
        } catch (\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error al retribuir los items del producto     '.$e]);
        }
    }
}