import { useState } from 'react'
import Logo from '../../imgs/logo.png'
import './SideBar.css'

import AlertDialog from '../Common/AlertDialog/AlertDialog';
import {Button} from '@mui/material';
import {Menu, MenuItem} from '@mui/material';

import { Link, Navigate } from 'react-router-dom'

import { SideBarData } from '../../Data/Data'
import {UilSignOutAlt, UilBars} from '@iconscout/react-unicons'

import {motion} from 'framer-motion'
import { Avatar, Collapse, List, ListItemButton, ListItemIcon } from '@mui/material'

import { useStateContext } from '../../Contexts/ContextProvider'

import SubMenu from './SubMenu/SubMenu';

const SideBar = () => {
    
    const [selected, setSelected] = useState(0)
    const [expanded, setExpanded] = useState(true)

    const [openLogOut, setOpenLogOut] = useState(false)


    const { getUser, setToken } = useStateContext()
    const user = getUser()

    const handleClick = (index) => {
        setSelected(index);
    }

    const sidebarVariants = {
        true: {
            left: '0'
        },

        false: {
            left: '-60%'
        }
    }
    
    return (
        <>
            <AlertDialog 
                open={openLogOut}
                cancelAction={()=>setOpenLogOut(false)}
                acceptAction={() => setToken(false)}
                contentText='Seguro que quieres cerrar tu sesion. Puedes volver a entrar cuando quieras.'
            />

            <div className='bars' style={expanded ? {left: '60%'} : {left: '5%'}}>
                <UilBars onClick={() => setExpanded(!expanded)}/>
            </div>
            <motion.div 
                variants={sidebarVariants}
                animate={window.innerWidth <= 768 ? `${expanded}` : ''}
                className='Sidebar'>
            {/** Logo */}
            <div className='logo'>
                <img src={Logo} alt='logo' />
                <span>
                    Danielka
                </span>
            </div>


            {/** Menu */}
            <div className='menu'>
                <Link to={`/perfil`} style={{all: 'unset'}}>
                    <div 
                        key={-1} 
                        className='menuItem'   
                    >
                        <Avatar sx={{width: '3rem', height:'3rem'}} alt={user.nombre} src={user.img}/> 
                       
                    </div>  
                </Link>
                {SideBarData.map((data, index) => {
                    return (
                            <Link to={`${data.heading.toLowerCase()}`} style={{all: 'unset'}}>
                                <div 
                                    key={index} 
                                    className={selected===index ? 'menuItem active' : 'menuItem'}
                                    onClick={(e) => {
                                        handleClick(index)
                                    }}    
                                >
                                    {data.icon}
                                    <span>{data.heading}</span>
                                </div>  
                            </Link>                 
                    )
                })}

                <div className='menuItem' onClick={() => setOpenLogOut(true)}>
                    <UilSignOutAlt />
                    <span>Salir</span>
                </div>            

            </div>
            </motion.div>
        </>
    )
}

export default SideBar