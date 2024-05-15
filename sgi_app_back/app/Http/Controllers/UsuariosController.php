<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Usuarios;
use App\Lib\JsonHelper;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use \stdClass;
use Validator;

class UsuariosController extends Controller
{
    
    public function loginUsuario(Request $request) {
        // Validar si los campos estan llenos
        $camposRequeridos = ['email', 'password'];
        foreach($camposRequeridos as $campo) {
            if (empty($request->$campo)) {
                return JsonHelper::jsonResponse(400, ['error' => 'Campo ' . $campo . ' requerido']);
            }
        }

        try {
            // Buscar el usuario (cargo tiene que ser diferente a cliente(14))
            $usuario = Usuarios::where('email', $request->email)
                                ->where('cargoId', '!=', 14)
                                ->firstOrFail();

            // verificar si existe algun empleado con el email dado
            if (is_null($usuario)) {
                return JsonHelper::jsonResponse(400, ['error' => 'Email: ' . $request->email . ' no existe en la base de datos']);
            }


            // Desencriptar password y ver si coincide con la de la request
            if (Hash::check($request->password, $usuario->password)) { // Acceso concedido
                // Tokens para el permiso de la api(Ver despues, pero indispensable para la subida a produccion)
                $accessToken = $usuario->createToken('auth_token')->plainTextToken;
               
                $data = [
                    'user' => [
                        'usuarioId' => $usuario->usuarioId,
                        'nombre' => $usuario->Nombre,
                        'apellido' => $usuario->Apellido,
                        'fechaNacimiento' => $usuario->fechaNacimiento,
                        'cargoId' => $usuario->cargoId,
                        'email' => $usuario->email,
                        'img' => 'data:image/jpeg;base64,'.base64_encode($usuario->img)
                    ],
                    'token' => $accessToken
                ];
                return JsonHelper::jsonResponse(200, ['user' => json_encode($data['user']), 'token' => json_encode($data['token'])]); // mandar sesion del usuario al cliente
            } else {
                return JsonHelper::jsonResponse(400, ['error' => 'Password incorrecta']);
            }
        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(400, ['error' => 'Error del servidor al buscar el usuario' . $e->getMessage()]);
        } 
    } 

    public function storeUsuario(Request $request) {
        if ($request->cargoId == '14') {
            $camposRequeridos = ['Nombre', 'Apellido'];
        } else {
            $camposRequeridos = ['Nombre', 'Apellido', 'cargoId', 'email', 'password', 'fechaNacimiento', 'fechaRegistro', 'activo'];
        }
    
        foreach ($camposRequeridos as $campo) {
            if (empty($request->$campo)) {
                return JsonHelper::jsonResponse(400, ['error' => 'El campo ' . $campo . ' es requerido']);
            }
        }
        try {
            //Encriptar la password antes de guardar el usuario a la base de datos
            $data = $request->except('password');
            $data['password'] = Hash::make($request->password);
            $usuario = Usuarios::create($data);
            $token = $usuario->createToken('auth_token')->plainTextToken;
            return JsonHelper::jsonResponse(200, ['message' => 'Usuario creado con exito!'/*, 'access_token' => $token, 'token_type' => 'Bearer'*/]);
        } catch (\Exception $e) {
            if ($e->getCode() == 23000) {
                return JsonHelper::jsonResponse(400, ['error' => 'El email ya existe']);
            }
            return JsonHelper::jsonResponse(500, ['error' => 'Error al crear el usuario: ' . $e->getCode() . ' en la base de datos(Contacte al desarrollador para mas informacion)']);
        }
    }

    public function logout() {
        // Esta funcionalidad aun no esta implementada en el frontend, solo en el backend
        auth()->user()->tokens()->delete();
        return JsonHelper::jsonResponse(200, ['message' => 'Logout realiazado con exito']);
    }
    /*
    public function indexEmpleados() {
        try {
            $empleados = Usuarios::tableShowEmpleados();
            return JsonHelper::jsonResponse(200, ['data' => $empleados]);
        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(500, ['error' => 'Error en el serviidor: ' . $e]);
        }
    }

    public function getCargosEmpleados() {
        try {
            $cargos = Usuarios::cargosEmpleados();
            return JsonHelper::jsonResponse(200, ['data' => $cargos]);
        } catch(\Exception) {
            return JsonHelper::jsonResponse(500, ['error' => 'Error en el servidor: ' . $e]);
        }
    }

    public function editEmpleado(Request $request, $id) {
        try {
            $empleado = Usuarios::findOrFail($id);
            $empleado->update($request->all());
            return JsonHelper::jsonResponse(200, ['Datos del usuario actualizado correctamente']);
        } catch(\Exception) {
            return JsonHelper::jsonResponse(500, ['error' => 'Error en el servidor: ' . $e]);
        }
    }

    public function desactivateUsuario(Request $request) {

        // Obtener ids
        try {
        
            $usuariosIds = $request->usuarios;
            $newActivateState = $request->activo;
    
            $registrosAfectados = Usuarios::whereIn('usuarioId', $usuariosIds)
                                            ->update(['activo' => $newActivateState]);

            return JsonHelper::jsonResponse('200', ['data' => $registrosAfectados]);
        } catch(\Exception $e) {
            return JsonHelper::jsonResponse('500', ['error' => 'Error en el servidor: ' . $e]);
        }

    }

    public function indexClientes() {
        try {
            $clientes = Usuarios::tableShowClientes();
            return JsonHelper::jsonResponse(200, ['data' => $clientes]);
        } catch(\Exception $e) {
            return JsonHelper::jsonResponse(500, ['error' => 'Error en el servidor(tableShowClientes): ' . $e]);
        }
    }
    */
}
