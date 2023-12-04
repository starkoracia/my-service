import axios from "axios";
import configData from "../config/configData";

const storageAuth = JSON.parse(window.localStorage.getItem('auth'));

const axiosFreeAuth = axios.create({
    baseURL: configData.SERVER_URL
})

export default axios.create({
    baseURL: configData.SERVER_URL,
    auth: {
        username: storageAuth.email,
        password: storageAuth.password
    }
})

export {axiosFreeAuth};


