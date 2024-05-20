import {useState} from 'react'
import Banner from '../../../Common/Banner/Banner'
import './Ordenes.css'
import Table from '../../../Common/Table/Table'
import RightDrawer from '../../../Common/RightDrawer/RightDrawer'
import { UilInvoice } from '@iconscout/react-unicons'

const Ordenes = () => {

    const [openForm, setFormOpen] = useState(false) 

    const generalActions = [
        {
            icon: <UilInvoice />,
            label: 'Nueva Orden',
            condition: () => true,
            action: () => setFormOpen(true)
        }
    ]

    return (
        <>
            <div className='ListaOrdenes'>

                <RightDrawer 
                    width={'100vw'} 
                    content={
                    <div>
                        <button onClick={()=> setFormOpen(false)}>Cerrar</button>
                    </div>
                    }  
                    open={openForm}/>

                <Banner>Lista de Ordenes</Banner>

                <div className='ordenes'>
                    <Table 
                        pagination={false}
                        rows={[]}
                        generalActions={generalActions}
                    />
                </div>

            </div>
        </>
    )
}

export default Ordenes