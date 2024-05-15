import { useState } from 'react'
import Logo from '../../imgs/logo.png'
import './SideBar.css'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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

            <Dialog
                open={openLogOut}
                onClose={() => setOpenLogOut(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
            {"Cerrar Sesion?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Seguro que quieres cerrar tu sesion. Puedes volver a entrar cuando quieras
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => setOpenLogOut(false)}>Cancelar</Button>
            <Button onClick={() => setToken(false)} autoFocus>
                Aceptar
            </Button>
            </DialogActions>
            </Dialog>


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
                    Dani<span>e</span>lka
                </span>
            </div>


            {/** Menu */}
            <div className='menu'>
                <div 
                    key={-1} 
                    className='menuItem'   
                >
                    <Avatar alt={user.nombre} src={user.img}/> 
                    <span>{`${user.nombre} ${user.apellido}`}</span>
                </div>  

                {SideBarData.map((data, index) => {
                    return (
                            data.heading != 'Inicio' ?
                            <SubMenu options={data.subIcons} onSelected={() => handleClick(index)}>
                                <div 
                                    key={index} 
                                    className={selected===index ? 'menuItem active' : 'menuItem'}   
                                >
                                    {data.icon}
                                    <span>{data.heading}</span>
                                </div>   
                            </SubMenu>
                            :
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