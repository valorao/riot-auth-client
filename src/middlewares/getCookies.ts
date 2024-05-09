import axios, { AxiosRequestConfig } from 'axios';
import GetClientVersion from '../services/GetClientVersionService';
import https from 'https';

const getClientVersion = new GetClientVersion();

export class GetCookies {
    readonly chiphers = [
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256'
    ];
    
    readonly agent = new https.Agent(
        {
            ciphers: this.chiphers.join(':'),
            honorCipherOrder: true,
            minVersion: 'TLSv1.3'
        });


    postAuthCookies = async () => {
        try {
            const version = await getClientVersion.ClientVersion();
            const url = 'https://auth.riotgames.com/api/v1/authorization';
            const body = {
                'client_id': 'play-valorant-web-prod',
                'nonce': '1',
                'redirect_uri': 'https://playvalorant.com/opt_in',
                'response_mode': 'query',
                'response_type': 'token id_token',
                'scope': 'account openid'
            };
    
            let UserAgent = `RiotClient/${version} rso-auth (Windows; 10;;Professional, x64)`;
            let headers = {
                'Content-Type': 'application/json',
                'User-Agent': UserAgent
            };
    
            let Config: AxiosRequestConfig = {
                headers: headers,
                httpsAgent: this.agent
            };
    
            let response  = await axios.post(url, body, Config).then(res => {
                return res;
            }).catch(err => {
                return err.response;
            })
            return response;
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}

