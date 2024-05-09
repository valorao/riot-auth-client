import { Request, Response } from 'express';

import { ReauthCookiesService } from '../services/ReauthCookiesService';

const reauthCookiesService = new ReauthCookiesService();

export const ReauthCookie = async (req: Request, res: Response) => {
    const response = await reauthCookiesService.handle(
        req.headers.cookie || ''
    )
    if (response.data.accessToken === null) {
        res.status(200).json({
            "status": 400,
            "message": "Bad Request"
        })
    }
    res.clearCookie('token');
    res.clearCookie('entitlements');
    res.cookie('token', response.data.accessToken, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
    });
    res.cookie('entitlements', response.data.entitlements, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
    });
    res.status(response.status).json({
        "status": response.status,
        "tokens": response.data
    });
}