import { Request, Response } from 'express';

export const BrowserLogout = (req: Request, res: Response) => {
    res.clearCookie('puuid'),
    res.clearCookie('ssid'),
    res.clearCookie('token'),
    res.clearCookie('entitlements'),
    res.clearCookie('puuid_onetime');
    res.clearCookie('ssid_onetime');
    res.clearCookie('bearertoken_onetime');
    res.clearCookie('entitlements_onetime');
    res.status(204).json({message: 'Logged out'})
}