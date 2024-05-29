<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Almacenes;

class AlmacenesController extends Controller
{
    public function insert_almacen(Request $request) {
        $almacen = $request['almacen'];
        return Almacenes::agregarAlmacen($almacen);
    }

    public function indexAlmacenes() {
        return Almacenes::getAllAlmacenes();
    }
}
