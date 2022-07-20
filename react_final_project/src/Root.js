import React, {Component} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ClientTable from "./ClientTable";
import ShowMessage from "./ShowMessage";
import Navbar from "./Navbar";
import PaymentTable from "./PaymentTable";
import WarehouseWindow from "./WarehouseWindow";
import Register from "./auth/Register";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";


export default class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: [],
            alertIsShow: false,
            alertVariant: 'success',
            alertMessage: ''
        }
    }

    showMessage = (message, variant) => {
        this.setState({
            alertIsShow: true,
            alertVariant: variant,
            alertMessage: message
        }, () => setTimeout(
            () => this.setState({alertIsShow: false}),
            3000
        ))
    }

    render() {
        const showMessage = this.showMessage;
        const alertVariant = this.state.alertVariant;
        const alertIsShow = this.state.alertIsShow;
        const alertMessage = this.state.alertMessage;
        return (
            <BrowserRouter>
                <ShowMessage
                    show={alertIsShow}
                    variant={alertVariant}
                    message={alertMessage}/>
                <Navbar/>
                <Routes>
                    <Route exact path="/" element={<Navigate replace to={"/clients"}/>}/>
                    <Route path="/clients/*" element={<ClientTable showMessage={showMessage}/>}/>

                    <Route element={<RequireAuth/>}>
                        <Route path="/payments/*" element={<PaymentTable showMessage={showMessage}/>}/>
                        <Route path="/warehouse/*" element={<WarehouseWindow showMessage={showMessage}/>}/>
                    </Route>

                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/register" element={<Register/>}></Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

