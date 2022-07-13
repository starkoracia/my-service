import axios from "axios";
import configData from "../configData";


export default axios.create({
    baseURL: configData.SERVER_URL
})