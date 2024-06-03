import React, { useState } from 'react'
import BasicTabs from '../../../../Common/BasicTabs/BasicTabs'
import { GrUserAdmin } from "react-icons/gr";
import { MdPersonSearch } from "react-icons/md";
import { FaPersonChalkboard } from "react-icons/fa6";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import CheckBoxTable from '../../../../Common/CheckBoxTable/CheckBoxTable';



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
                        state={administrador}
                        setState={setAdministrador}
                    />,
                    icon: <GrUserAdmin />
                },
                {
                    label: 'Controlador',
                    component: <CheckBoxTable
                        state={controlador}
                        setState={setControlador}
                    />,
                    icon: <MdPersonSearch />
                },
                {
                    label: 'Vendedor',
                    component: <CheckBoxTable
                        state={vendedor}
                        setState={setVendedor}
                    />,
                    icon: <FaPersonChalkboard />
                },
                {
                    label: 'Bodega',
                    component: <CheckBoxTable
                        state={bodeguero}
                        setState={setBodeguero}
                    />,
                    icon: <FaPersonWalkingLuggage />
                }
            ]}
        />
    )
}

export default Permisos