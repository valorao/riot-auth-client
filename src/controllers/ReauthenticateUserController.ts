import { Request, Response } from 'express';
import { ReauthCookiesService } from '../services/ReauthCookiesService';
import 'dotenv/config';

const reauthCookiesService = new ReauthCookiesService();
const domain = process.env.DOMAIN || '.valorao.cloud';

export const ReauthCookie = async (req: Request, res: Response) => {
    if(!req.headers.cookie) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request - NO_COOKIES",
            "message": "Authenticate first"
        });
    }
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
    res.clearCookie('bearertoken_onetime');
    res.clearCookie('entitlements_onetime');
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