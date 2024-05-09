import { Request, Response } from 'express';

export const GetBrowserCookies = (req: Request, res: Response) => {
    const puuid = req.cookies.puuid;
    const ssid = req.cookies.ssid;
    const token = req.cookies.token;
    const entitlements = req.cookies.entitlements;

    res.json ({puuid, ssid, token, entitlements})
}