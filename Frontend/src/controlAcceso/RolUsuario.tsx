import { Navigate, Outlet } from 'react-router-dom';
import { Roles } from '../entities/Roles';
import { useState } from 'react';
import { obtenerSesion, Sesion } from '../services/sesion';

interface Props {
  rol: Roles;
}

function RolUsuario({ rol }: Props) {

    // obtenerSesion descarta la sesión si el token ya venció
    const [sesion] = useState<Sesion | null>(() => obtenerSesion());

    //si esta logueado y es administrador lo dejo ingresar si no
    if (sesion && sesion.rol === rol) {
        return <Outlet />;
    } else if (sesion) {
        return <Navigate replace to='/grilla' />;
    } else {
        return <Navigate replace to='/login' />;
    }

}
export default RolUsuario;
