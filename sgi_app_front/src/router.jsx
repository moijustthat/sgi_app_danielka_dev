import { Navigate, createBrowserRouter } from "react-router-dom";

import Login from "./components/Pages/Login";
import App from "./App";
import DefaultLayout from "./components/Pages/DefaultLayout";
// Paginas
import Inicio from "./components/Pages/Inicio/Inicio";
import NotFound from "./components/Pages/NotFound/NotFound";
import Perfil from "./components/Pages/Perfil/Perfil";
import Productos from "./components/Pages/Inventario/Productos/Productos";
import Ordenes from "./components/Pages/Facturacion/Ordenes/Ordenes";
import Inventario from "./components/Pages/Inventario/Inventario";
import Facturacion from "./components/Pages/Facturacion/Facturacion"
import Usuarios from "./components/Pages/Usuarios/Usuarios";
import Existencias from "./components/Pages/Existencias/Existencias";


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Navigate to='/inicio' />
            },
            {
                path: '/facturacion',
                element: <Facturacion />
            },
            {
                path: '/productos',
                element: <Inventario />
            },
            {
                path: '/existencias',
                element: <Existencias />
            },
            {
                path: '/inicio',
                element: <Inicio />
            },
            {
                path: '/perfil',
                element: <Perfil />
            },
            {
                path: '/usuarios',
                element: <Usuarios />
            },
            {
                path: '/listar-ventas',
                element: <h1>Listar Ventas</h1>
            },
            {
                path: '/nueva-orden',
                element: <h1>Nueva Orden</h1>
            },
            {
                path: '/nueva-venta',
                element: <h1>Nueva Venta</h1>
            },
            {
                path: '/listar-productos',
                element: <Productos />
            },
            {
                path: '/listar-almacenes',
                element: <h1>Tabla de almacenes</h1>
            }
        ]
    }, 
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
])

export default router