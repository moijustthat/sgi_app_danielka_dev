<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Controladores:
use App\Http\Controllers\UsuariosController;
use App\Http\Controllers\ProductosController;
use App\Http\Controllers\ProveedoresController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\OrdenesController;
use App\Http\Controllers\VentasController;
use App\Http\Controllers\AlmacenesController;



Route::controller(UsuariosController::class)->group(function () {
    Route::post('/login', 'loginUsuario');
   
    //Route::patch('/usuarios/desactivate', 'desactivateUsuario');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/logout', 'logout');
        Route::get('/clientes', 'indexClientes');
        Route::post('/register', 'storeUsuario');
        //Route::patch('/usuarios/edit/{id}', 'editEmpleado');

        //Route::get('/empleados', 'indexEmpleados');
        //Route::get('/empleados/cargos', 'getCargosEmpleados');
        //Route::get('/clientes', 'indexClientes');
    });
});

Route::controller(ProductosController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/productos', 'index');
        Route::get('/seleccionables', 'getItemsSeleccionables');
        Route::post('/productos', 'agregarProductos');
        Route::post('/desactivate-productos', 'desactivarProductos');
        Route::post('/updateProducto', 'actualizarProducto');

    });
});

Route::controller(AlmacenesController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/almacen', 'insert_almacen');
        Route::get('/almacenes', 'indexAlmacenes');
    });
});

Route::controller(ProveedoresController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/proveedores', 'index');
        Route::post('/proveedor', 'insert_proveedor');
    });
});

Route::controller(ItemsController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/cargos', 'indexCargos');
        Route::post('/categoria', 'insert_categoria');
        Route::post('/marca', 'insert_marca');
        Route::post('/unidad_medida', 'insert_unidad_medida');
    });
});

Route::controller(OrdenesController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/orden', 'insert_orden');
    });
});

Route::controller(VentasController::class)->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/venta', 'insert_venta');
    });
});