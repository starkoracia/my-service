import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'hystmodal/dist/hystmodal.min.css'
import Root from "./Root";
import {AuthProvider} from "./context/AuthProvider";


ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <Root/>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
