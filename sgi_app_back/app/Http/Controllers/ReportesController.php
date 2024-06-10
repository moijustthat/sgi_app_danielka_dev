<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Reportes;
use App\Lib\JsonHelper;

class ReportesController extends Controller
{
    public function financialResume() {
        return Reportes::getFinancialResume();
    }
}
