import React, { useState } from 'react'
import BasicTabs from '../../../../Common/BasicTabs/BasicTabs'
import { GrUserAdmin } from "react-icons/gr";
import { MdPersonSearch } from "react-icons/md";
import { FaPersonChalkboard } from "react-icons/fa6";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import CheckBoxTable from '../../../../Common/CheckBoxTable/CheckBoxTable';
import axiosClient from '../../../../../axios-client';
import axios from 'axios';

const Permisos = ({
    all,
    setAll,
    administrador,
    setAdministrador,
    controlador,
    setControlador,
    vendedor,
    setVendedor,
    bodeguero,
    setBodeguero
}) => {




    return (
        <BasicTabs
            features={[
                {
                    label: 'Administrador',
                    component: <CheckBoxTable
                        label='Permisos del administrador'
                        footer='No puedes cambiar los permisos admin'
                        idState={135}
                        state={administrador}
                        setState={(index) => { }}
                    />,
                    icon: <GrUserAdmin />
                },
                {
                    label: 'Controlador',
                    component: <CheckBoxTable
                        idState={142}
                        state={controlador}
                        setState={(index) => {
                            const copy = [...controlador];
                            const payload = { cargoId: 142, moduloId: Number(copy[index].moduloId), estado: copy[index].check ? 'f' : 't' }
                            axiosClient.post('/permisosUpdate', payload)
                                .then(({ data }) => {
                                    const response = data.message
                                    console.log(response)
                                    copy[index].check = !!!copy[index].check;
                                    setControlador(prev => {
                                        return copy;
                                    })
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }}
                    />,
                    icon: <MdPersonSearch />
                },
                {
                    label: 'Vendedor',
                    component: <CheckBoxTable
                        idState={134}
                        state={vendedor}
                        setState={(index) => {
                            const copy = [...vendedor];
                            const payload = { cargoId: 134, moduloId: Number(copy[index].moduloId), estado: copy[index].check ? 'f' : 't' }
                            axiosClient.post('/permisosUpdate', payload)
                                .then(({ data }) => {
                                    const response = data.message
                                    console.log(response)
                                    copy[index].check = !!!copy[index].check;
                                    setVendedor(prev => {
                                        return copy;
                                    })
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }}
                    />,
                    icon: <FaPersonChalkboard />
                },
                {
                    label: 'Bodega',
                    component: <CheckBoxTable
                        label='Permisos para los y las encargadas de bodega'
                        footer=''
                        idState={136}
                        state={bodeguero}
                        setState={(index) => {
                            const copy = [...bodeguero];
                            const payload = { cargoId: 136, moduloId: Number(copy[index].moduloId), estado: copy[index].check ? 'f' : 't' }
                            axiosClient.post('/permisosUpdate', payload)
                                .then(({ data }) => {
                                    const response = data.message
                                    console.log(response)
                                    copy[index].check = !!!copy[index].check;
                                    setBodeguero(prev => {
                                        return copy;
                                    })
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }}
                    />,
                    icon: <FaPersonWalkingLuggage />
                }
            ]}
        />
    )
}

export default Permisos