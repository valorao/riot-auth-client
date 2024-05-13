import { Request, Response } from 'express';
import 'dotenv/config';

const domain = process.env.DOMAIN || 'localhost';

export const BrowserLogout = (req: Request, res: Response) => {
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none' as const,
        secure: true,
        path: '/',
        domain: domain, // replace with your domain
    };

    res.cookie('token', '', cookieOptions);
    res.cookie('entitlements', '', cookieOptions);
    res.cookie('puuid', '', cookieOptions);
    res.cookie('ssid', '', cookieOptions);

    res.status(204).json({message: 'Logged out'});
}