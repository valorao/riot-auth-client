import axios, { AxiosRequestConfig } from 'axios';
import 'dotenv/config';

export class GetEntitlements {
    Entitlements = async (token: string) => {
        axios.defaults.baseURL = 'https://entitlements.auth.riotgames.com/api/token/v1'
        axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
        axios.defaults.headers.post['Content-Type'] = 'application/json'

        let response = await axios.post(axios.defaults.baseURL, axios.defaults.headers).then(res => {
            return res;
        }).catch(err => {
            return err.response;
        });
        return response;
    } 

}
