import { createBrowserRouter } from "react-router-dom";
import Login from "../views/Login";
import SignUp from "../views/SignUp";
import NotFound from "../views/NotFound";
import DefaultLayout from "../Components/Layouts/DefaultLayout";
import GuessLayout from "../Components/Layouts/GuessLayout";
import Dashboard from "../views/Home/Dashboard/Dashboard";

import Empresa from '../views/Configuracion/Empresa/Empresa';
import Cuenta from "../views/Configuracion/Cuenta/Cuenta";
import Empleados from "../views/Empleados/Empleados";

const router = createBrowserRouter(/*routes:*/ [
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            /*Todos las rutas permitidas para este layout*/
            {
                path: '/',
                element: <Dashboard />,
            },
            {
                path: "/reportes/ventas/articulo",
                element: <h1>Ventas por articulo</h1>
            },
            {
                path: "/reportes/ventas/categoria",
                element: <h1>Ventas por categoria</h1>
            },
            {
                path: "/reportes/ventas/marca",
                element: <h1>Ventas por marca</h1>
            },
            {
                path: "/reportes/ventas/empleado",
                element: <h1>Ventas por empleado</h1>
            },
            {
                path: "/reportes/ventas/pago",
                element: <h1>Ventas por tipo de pago</h1>
            },
            {
                path: "/reportes/descuentos",
                element: <h1>Ventas por descuentos</h1>
            },
            {
                path: "/reportes/compras",
                element: <h1>Reporte de compras</h1>
            },
            {
                path: "/inventario/articulos",
                element: <h1>Articulos</h1>
            },
            {
                path: "/inventario/categorias",
                element: <h1>Categorias</h1>
            },
            {
                path: "/inventario/marcas",
                element: <h1>Marcas</h1>
            },
            {
                path: "/inventario/almacenes",
                element: <h1>Almacenes</h1>
            },
            {
                path: "/inventario/proveedores",
                element: <h1>Proveedores</h1>
            },
            {
                path: "/stock/entradas",
                element: <h1>Entradas</h1>
            },
            {
                path: "/stock/listado",
                element: <h1>Listado</h1>
            },
            {
                path: "/stock/devolucion",
                element: <h1>Devolucion</h1>
            },
            {
                path: "/stock/perdida",
                element: <h1>Perdida</h1>
            },
            {
                path: "/stock/orden",
                element: <h1>Orden a proveedor</h1>
            },
            {
                path: "ventas/caja",
                element: <h1>Ventas</h1>
            },
            {
                path: "facturacion/recibos/clientes",
                element: <h1>Recibos de venta</h1>
            },
            {
                path: "facturacion/recibos/proveedores",
                element: <h1>Recibos de la empresa</h1>
            },
            {
                path: "facturacion/cuentas/cobrar",
                element: <h1>Cuentas por cobrar</h1>
            },
            {
                path: "facturacion/cuentas/pagar",
                element: <h1>Cuentas por pagar</h1>
            },
            {
                path: "empleados/lista",
                element: <Empleados/>
            },
            {
                path: "empleados/permisos",
                element: <h1>Permisos</h1>
            },
            {
                path: "clientes",
                element: <h1>Clientes</h1>
            },
            {
                path: "configuracion/cuenta",
                element: <Cuenta />
            },
            {
                path: "configuracion/empresa",
                element: <Empresa />
            },
            {
                path: "configuracion/general",
                element: <h1>Configuracion general</h1>
            },
        ]
    },
    {
        path: "/",
        element: <GuessLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Login />,
            },
        ]
    },
    {
        path: "*",
        element: <NotFound />,
    }
]);

export default router;
