<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use App\Lib\HandleDbResponse;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Usuarios extends Authenticatable {

    use HasApiTokens, HasFactory, Notifiable;

    protected $table = "usuarios";
    protected $primaryKey = "usuarioId";
    protected $accessTokenColumn = 'apiToken';

    protected $fillable = ["Nombre", "Apellido", "fechaNacimiento", "fechaRegistro", "activo", "cargoId", "email", "password", "apiToken", "direccion", "rut", "img", "horaRegistro", "numeroRut", "Telefono"];

    public $timestamps = false;

    public static function findUsuario($email) {
        return DB::table('Usuarios')->where('email', $email)
                                    ->where('cargoId', '!=', 14)
                                    ->first();
    }

    public static function tableShowEmpleados() {
        //return DB::select('select * from table_show_empleados ORDER BY empleadoId DESC');
    }

    public static function cargosEmpleados() {
        return DB::select('select * from cargos where cargoId != 14');
    }

    public static function getAllClientes() {
        return HandleDbResponse::handleResponse(function() {
            $clientes = DB::select('select * from vw_clientes');
            return JsonHelper::jsonResponse(200, ['data'=>$clientes]);
        }, 'Error al traer todos los clientes');
    }

    public static function getPermisosDe($id) {
        return HandleDbResponse::handleResponse(function() use ($id) {
            $permisos = DB::select('select * from Permisos WHERE cargoId = ?', [$id]);
            return JsonHelper::jsonResponse(200, ['permisos'=>$permisos]);
        }, 'Error al recuperar los permisos del usuario');
    }

    public static function getAllPermisos() {
        return HandleDbResponse::handleResponse(function() {
            return DB::transaction(function () {
                // Traer esos datos que van en las tablas y formularios donde aparecen los productos
                $all = DB::select('select * from Modulos');
                $administrador = DB::select('select * from vista_permisos_administrador');
                $controlador = DB::select('select * from vista_permisos_controlador');
                $vendedor = DB::select('select * from vista_permisos_vendedor');
                $bodeguero = DB::select('select * from vista_permisos_bodeguero');

                // Agrupamiento de respuestas
                $permisos = [
                    'all' => $all,
                    'administrador' => $administrador,
                    'controlador' => $controlador,
                    'vendedor' => $vendedor,
                    'bodeguero' => $bodeguero
                ];

                return JsonHelper::jsonResponse(200, ['permisos'=>$permisos]);
            });
        }, 'Error al obtener los permisos de los empleados');
    }
}
