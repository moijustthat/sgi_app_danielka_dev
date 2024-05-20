<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Controladores:
use App\Http\Controllers\UsuariosController;
use App\Http\Controllers\ProductosController;



Route::controller(UsuariosController::class)->group(function () {
    Route::post('/login', 'loginUsuario');
   
    //Route::patch('/usuarios/desactivate', 'desactivateUsuario');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/logout', 'logout');
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

