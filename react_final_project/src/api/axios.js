import axios from "axios";
import configData from "../config/configData";


export default axios.create({
    baseURL: configData.SERVER_URL
})