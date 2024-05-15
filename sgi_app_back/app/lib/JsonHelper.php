<?php

namespace App\Lib;

class JsonHelper {
    public static function jsonResponse($statusCode, $body) {
        return response()->json($body, $statusCode); // respuesta al front end
    }
}