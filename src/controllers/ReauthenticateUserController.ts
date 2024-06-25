import { Request, Response } from 'express';
import { ReauthCookiesService } from '../services/ReauthCookiesService';
import { EncryptJWT } from 'jose';
import 'dotenv/config';

const reauthCookiesService = new ReauthCookiesService();
const domain = process.env.DOMAIN || '.valorao.cloud';

export const ReauthCookie = async (req: Request, res: Response) => {
    if ((req.query.jwt as any) === true || (req.query.jwt as any) === 'true') {
        const ssid = 'ssid=' + req.query.ssid
        const response = await reauthCookiesService.handle(
            ssid
        )
        const puuid = req.query.puuid
        const secretHex = process.env.SECRET;
        const secret = Buffer.from((secretHex as string), 'hex');
        const expiry = '1h';

        const payload = {
            token: response.data.accessToken,
            puuid: puuid,
            entitlements: response.data.entitlements,
            expiry: expiry,
        }
        let jwt = await new EncryptJWT(payload).setProtectedHeader({alg: 'dir', enc: 'A256GCM'})
        .setExpirationTime(expiry)
        .encrypt(secret);
        res.status(200).json({
            token: jwt,
        })
        return;
    }
    if(!req.headers.cookie) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request - NO_COOKIES",
            "message": "Authenticate first"
        });
    }
    else if (req.query.jwt == undefined || req.query.jwt == null){
        const response = await reauthCookiesService.handle(
            req.headers.cookie || ''
        )
        if (response.data.accessToken === null) {
            return res.status(400).json({
                "status": 400,
                "message": "Bad Request - NO_TOKEN"
            })
        }
        res.clearCookie('token');
        res.clearCookie('entitlements');
        res.cookie('token', response.data.accessToken, {
            maxAge: 60 * 60 * 24 * 7 * 1000,
            httpOnly: true,
            path: '/',
            domain: domain,
        });
        res.cookie('entitlements', response.data.entitlements, {
            maxAge: 60 * 60 * 24 * 7 * 1000,
            httpOnly: true,
            path: '/',
            domain: domain,
        });
        res.status(response.status).json({
            "status": response.status,
            "tokens": response.data
        });
    }
}