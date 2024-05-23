<?php

namespace App\Lib;

class ImgProccessor {
    public static function binToHex($img_base64) {
        return '0x'.bin2hex(base64_decode($img_base64));
    }
}