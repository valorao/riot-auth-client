import { Request, Response } from 'express';

export const BrowserLogout = (req: Request, res: Response) => {
    res.clearCookie('puuid'),
    res.clearCookie('ssid'),
    res.clearCookie('token'),
    res.clearCookie('entitlements'),
    res.status(204).json({message: 'Logged out'})
}