import axios, { AxiosRequestConfig } from 'axios';
import 'dotenv/config';

export class GetClientVersion {
    ClientVersion = async (token: boolean) => {

    let response  = await axios.get('https://valorant-api.com/v1/version').then(res => {
        return res
    }).catch(err => {
        return err.response
    });
    return response;
    }
}
