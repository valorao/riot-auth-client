import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';

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

    AuthCookies = async (riotClientBuild: string, username : string, password : string, asid : string) => {
        const url = 'https://auth.riotgames.com/api/v1/authorization';
        const body = {
            'type': 'auth',
            'username': username,
            'password': password
        };

        let UserAgent = `RiotClient/${riotClientBuild} rso-auth (Windows; 10;;Professional, x64)`;
        let headers = {
            'Content-Type': 'application/json',
            'User-Agent': UserAgent,
            'Cookie': asid
        };

        let Config: AxiosRequestConfig = {
            headers: headers,
            httpsAgent: this.agent
        };

        let response  = await axios.put(url, body, Config).then(res => {
            return res;
        }).catch(err => {
            return err.response;
        });
        console.log(response.headers['set-cookie'].find((cookie: string) => cookie.startsWith('ssid')));
        return response;

    }
}
