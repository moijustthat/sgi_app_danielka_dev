<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Lib\JsonHelper;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Usuarios extends Authenticatable {

    use HasApiTokens, HasFactory, Notifiable;

    protected $table = "usuarios";
    protected $primaryKey = "usuarioId";
    protected $accessTokenColumn = 'apiToken';

    protected $fillable = ["Nombre", "Apellido", "fechaNacimiento", "fechaRegistro", "activo", "cargoId", "email", "password", "apiToken", "direccion"];

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

    public static function tableShowClientes() {
        //return DB::select('select * from table_show_clientes ORDER BY clienteId DESC');
    }
}
