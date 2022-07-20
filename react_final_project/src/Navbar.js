import React from 'react';
import {Link, NavLink} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";


function Navbar() {

    const {auth, setAuth} = useAuth();
    const storageAuth = JSON.parse(window.localStorage.getItem('auth'));

    function logout() {
        window.localStorage.setItem('auth', JSON.stringify({}));
        setAuth({});
        axios.defaults.auth = null;
    }

    return (
        <div className={'navbar-bs'}>
            <Link className={'brand'} to={"/"}>
                <img className={'brand-svg-img'} src={'/images/service.svg'}/>
            </Link>
            {/*<NavLink className={'nav-link nav-bar'} to={"/"}*/}
            {/*         activeClassName={'nav-link-selected'}>*/}
            {/*    <img className={'navbar-svg-img'} src={'/images/orders.svg'}/>*/}
            {/*    <span className={'navbar-text'}>Заказы</span>*/}
            {/*</NavLink>*/}
            <NavLink className={'nav-link nav-bar'} to={"/clients"}
                     activeClassName={'nav-link-selected'}>
                <img className={'navbar-svg-img'} src={'/images/clients.svg'}/>
                <span className={'navbar-text'}>Клиенты</span>
            </NavLink>
            <NavLink className={'nav-link nav-bar'} to={"/payments"}
                     activeClassName={'nav-link-selected'}>
                <img className={'navbar-svg-img'} src={'/images/payments.svg'}/>
                <span className={'navbar-text'}>Платежы</span>
            </NavLink>
            <NavLink className={'nav-link nav-bar'} to={"/warehouse"}
                     activeClassName={'nav-link-selected'}>
                <img className={'navbar-svg-img'} src={'/images/warehouse.svg'}/>
                <span className={'navbar-text'}>Склад</span>
            </NavLink>
            {auth?.email || storageAuth?.email
                ? (
                    <NavLink className={'nav-link nav-bar'} to={'/login'}
                             onClick={logout} style={{marginTop: "auto"}}>
                        <span className={'navbar-text'}>Выйти</span>
                    </NavLink>
                )
                : (
                    <NavLink className={'nav-link nav-bar'} to={'/login'}
                             style={{marginTop: "auto"}}>
                        <span className={'navbar-text'}>Войти</span>
                    </NavLink>
                )
            }
        </div>
    )
}

export default Navbar;