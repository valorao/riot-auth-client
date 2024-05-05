import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
import { GetCookies } from './getCookies';

export class AuthAccount {
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

    AuthCookies = async (riotClientBuild: string) => {
        const url = 'https://auth.riotgames.com/api/v1/authorization';
        const body = {
            'type': 'auth',
            'username': '',
            'password': ''
        };

        let UserAgent = `RiotClient/${riotClientBuild} rso-auth (Windows; 10;;Professional, x64)`;
        let headers = {
            'Content-Type': 'application/json',
            'User-Agent': UserAgent,
            'Cookie': 'asid=Z74wj3ulW9raaoFg7XBfsZN53OKooGArGrkbD2NetgM.KDdSdtKqdf0%3D; Path=/; HttpOnly; Secure; SameSite=Strict'
        };

        let Config: AxiosRequestConfig = {
            headers: headers,
            httpsAgent: this.agent
        };

        let response  = await axios.put(url, body, Config).then(res => {
            console.log(res.status)
            return res;
        })
        return response;

    }
}
