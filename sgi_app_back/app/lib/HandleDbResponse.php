<?php

namespace App\Lib;
use Exception;
use App\Lib\JsonHelper;

class HandleDbResponse {
    public static function handleResponse($callback, $errMsg) {
        try {
            return $callback();
        } catch (Exception $e) {
            $fullErrorMessage = $e->getMessage();

            // Extraer solo el mensaje que entiende el usuario(y yo tambien XD)
            $pattern = '/SQLSTATE\[45000\]: <<Unknown error>>: \d+ (.+?) \(Connection: mysql,/';
            $matches = [];
        
            if (preg_match($pattern, $fullErrorMessage, $matches)) {
                // Si se encuentra el patron usarlo como respuesta de error
                $errorMessage = $matches[1];
            } else {
                // Si no se encuentra el patron, aguas que se manda algo que ni yo se leer
                $errorMessage = $fullErrorMessage;
            }
            return JsonHelper::jsonResponse(500, ['messageError'=> $errorMessage, 'message'=>$errMsg]);
        }
    }
}