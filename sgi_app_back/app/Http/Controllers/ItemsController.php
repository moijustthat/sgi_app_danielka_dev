<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Items;

class ItemsController extends Controller
{

    public function indexCargos() {
        return Items::getAllCargos();
    }

    public function insert_categoria(Request $request) {
        return Items::new_categoria($request['categoria']);
    }

    public function insert_marca(Request $request) {
        return Items::new_marca($request['marca']);
    }

    public function insert_unidad_medida(Request $request) {
        return Items::new_unidad_medida($request['medida']);
    }

    public function desactivarCategorias(Request $request) {
        return Items::desactivateCategorias($request['categorias']);
    }

    public function desactivarMarcas(Request $request) {
        return Items::desactivateMarcas($request['marcas']);
    }

    public function desactivarUnidadesMedida(Request $request) {
        return Items::desactivateUnidadesMedida($request['medidas']);
    }
}
