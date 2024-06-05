// Sidebar imports
import {
    UilEstate,
    UilBill,
    UilUsersAlt,
    UilPackage,
    UilChartPieAlt,
    UilUsdSquare,
    UilClipboardNotes
} from '@iconscout/react-unicons';

import { LuClipboardList } from "react-icons/lu";

import { usersInfo } from './EmpleadosInfo';

export const SideBarData = [
    {
        icon: <UilEstate />,
        heading: 'Inicio'
    },

    {
        icon: <UilBill />,
        heading: 'Facturacion',
    },

    {
        icon: <UilUsersAlt />,
        heading: 'Usuarios'
    },
    {
        icon: <UilPackage />,
        heading: 'Productos',
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
            background: 'linear-gradient(180deg, #557290 0%, #83729D 100%)',
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
            background: 'linear-gradient(180deg, #60CD99 0%, #A6E684 100%)',
            boxShadow: '0px 10px 20px 0px #82F9BE'
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
            background: 'linear-gradient(180deg, #7CA3B7 0%, #C7F8FF 100%)',
            boxShadow: '0px 10px 20px 0px #EAFCFF'
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