import axios, { AxiosRequestConfig } from 'axios';
import 'dotenv/config';

export class GetPlayerInfo {
    PlayerInfo = async (token: string) => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

    let response  = await axios.get('https://auth.riotgames.com/userinfo', config).then(res => {
        return res
    }).catch(err => {
        return err.response
    });
    return response;
    }
}
