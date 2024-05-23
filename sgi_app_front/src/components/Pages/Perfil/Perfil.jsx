import React from 'react'
import Header from './HeaderPerfil/Header'
import ProfileInfo from './UserInfo/ProfileInfo'
import './Perfil.css'
import { useStateContext } from '../../../Contexts/ContextProvider'
import { FormPassword, FormData } from './UserForms/FormPassword'

const Perfil = () => {

    const {getUser} = useStateContext()
    const user = getUser()

    return (
        <div className='PerfilContainer'>
            <Header nombreUsuario='Perfil'/>

            <div className='PerfilContent'>
                <div className='profileInfo'>
                    <ProfileInfo/>
                </div>
                <div className='formData'>
                    <FormData/>
                </div>
                <div className='formPassword'>
                    <FormPassword/>
                </div>
            </div>

        </div>
    )
}

export default Perfil