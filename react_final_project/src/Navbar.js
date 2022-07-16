import React, {Component} from 'react';
import {Link, NavLink} from "react-router-dom";


class Navbar extends Component {

    render() {
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
            </div>
        );
    }
}

export default Navbar;