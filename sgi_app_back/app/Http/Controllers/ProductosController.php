<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Productos;
use App\Lib\JsonHelper;

class ProductosController extends Controller
{

    public function index() {
        return Productos::getAllProducts();
    }

    public function agregarProductos(Request $request) {
        $validatedData = $request->validate([
            'productos' => 'required|array',
            'productos.*' => 'required|array',
        ]);

        $arrayData = $validatedData['productos'];

        $res = Productos::saveNewProducts($arrayData);
        return $res;
    }

    public function getItemsSeleccionables() {
        try {
            return Productos::get_items_for_products();
        } catch (\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error al retribuir los items del producto     '.$e]);
        }
    }
}