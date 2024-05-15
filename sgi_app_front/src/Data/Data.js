// Sidebar imports
import {
    UilEstate,
    UilClipboardAlt,
    UilUsersAlt,
    UilPackage,
    UilChartPieAlt,
    UilUsdSquare 
} from '@iconscout/react-unicons';



import { usersInfo } from './EmpleadosInfo';

export const SideBarData = [
    {
        icon: <UilEstate />,
        heading: 'Inicio'
    },

    {
        icon: <UilClipboardAlt />,
        heading: 'Ordenes',
        subIcons: [
            {
                heading: 'Listar Ordenes',
                url: '/listar-ordenes'
            },
            {
                heading: 'Listar Ventas',
                url: '/listar-ventas'
            },
            {
                heading: 'Nueva Orden',
                url: '/nueva-orden'
            },
            {
                heading: 'Nueva Venta',
                url: '/nueva-venta'
            }
        ]
    },

    {
        icon: <UilUsersAlt />,
        heading: 'Clientes'
    },

    {
        icon: <UilPackage />,
        heading: 'Inventario',
        subIcons: [
            {
                heading: 'Catalogo de Productos',
                url: '/listar-productos'
            },
            {
                heading: 'Lista de Almacenes',
                url: '/listar-almacenes'
            }
        ]
    },

    {
        icon: <UilChartPieAlt />,
        heading: 'Reportes'
    }
]

export const CardsData = [
    {
        title: 'Ventas',
        color: {
            background: 'linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)',
            boxShadow: '0px 10px 20px 0px #e0c6f5'
        },
        barValue: 54,
        value: '23,232',
        png: <UilUsdSquare />, //icono superior derecha
        series: [
            {
                name: 'ventas',
                data: [31, 40, 28, 51, 42, 109, 100]
            }
        ]
    },

    {
        title: 'Compras',
        color: {
            background: 'linear-gradient(180deg, #ff919d 0%, #fc929d 100%)',
            boxShadow: '0px 10px 20px 0px #fdc0c7'
        },
        barValue: 20,
        value: '23,232',
        png: <UilUsdSquare />, //icono superior derecha
        series: [
            {
                name: 'compras',
                data: [31, 40, 28, 51, 42, 109, 100]
            }
        ]
    },

    {
        title: 'Ganancias',
        color: {
            background: 'linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255, 202, 113) -46.42%)',
            boxShadow: '0px 10px 20px 0px #f9d59b'
        },
        barValue: 80,
        value: '23,232',
        png: <UilUsdSquare />, //icono superior derecha
        series: [
            {
                name: 'ganancias',
                data: [31, 40, 28, 51, 42, 109, 100]
            }
        ]
    }
]

export const UpdatesData = [
    {
        img: usersInfo[0].img,
        name: usersInfo[0].name,
        notification: 'Ha vendido 7 libras de clavo',
        time: '25 seconds ago'
    },

    {
        img: usersInfo[1].img,
        name: usersInfo[1].name,
        notification: 'Ha vendido 7 libras de clavo',
        time: '25 seconds ago'
    },

]