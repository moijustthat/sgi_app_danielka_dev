<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Inventario;

class InventarioController extends Controller
{

    public function indexEntradas() {
        return Inventario::getAllEntradas();
    }

    public function getInventario($id) {
        return Inventario::getInventarioProducto($id);
    }

    public function insert_entrada(Request $request) {
        $entrada = $request['entrada'];
        return Inventario::nuevaEntrada($entrada);
    }
}
