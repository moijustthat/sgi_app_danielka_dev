<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Requests\LoginRequest;
use Illuminate\Http\Requests\SignUpRequest;



class AuthController extends Controller
{
    public function login(LoginRequest $request) {
        $credentials = $request->validate();
        if (!!!Auth::attempt($credentials)) {
            return response([
                'message'=> 'El email o contraseña no son validos'
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function signup(SignUpRequest $request) {
        $data = $request->validate();
        $user = Usuario::create([
            'nombre' => $data['nombre'],
            'apellido' => $data['apellido'],
            'usuario' => $data['usuario'],
            'correo' => $data['correo'],
            'password' => bcrypt($data['password'])
        ]);

        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function logout(Request $request) {
        $user = $request->user();
        $user->currentAccessToken()->delete();
    }
}
