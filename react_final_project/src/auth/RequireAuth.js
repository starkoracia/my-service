import useAuth from "../hooks/useAuth";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import axios from "../api/axios";


const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

    const storageAuth = JSON.parse(window.localStorage.getItem('auth'));
    if(storageAuth?.email) {
        axios.defaults.auth = {
            username: storageAuth.email,
            password: storageAuth.password
        }
    }
    return (
        auth?.email || storageAuth?.email
            ? <Outlet />
            : <Navigate to={"/login"} state={{from: location}} replace />
    )
}

export default RequireAuth;