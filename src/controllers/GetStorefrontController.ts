import { Request, Response } from 'express';
import GetStorefrontService from '../services/GetStorefrontService';
import { jwtDecrypt } from 'jose';
const getStorefrontService = new GetStorefrontService();

export const Storefront = async (req: Request, res: Response) => {
    console.log(req.cookies)
    if (!req.cookies.token || !req.cookies.entitlements || !req.cookies.puuid) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "missing body parameters"
        });
    }
    const response = await getStorefrontService.handle(
        req.cookies.token, req.cookies.entitlements, req.cookies.puuid
    );
    if (response.status === 400) {
        return res.status(401).json({
            "status": 401,
            "message": "Please relogin or reauth cookies."
        })
    }
    res.status(response.status).json(response)
}

export const storeFrontJWT = async (req: Request, res: Response) => {
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({
                "status": 400,
                "error": "Bad Request",
                "message": "missing body parameters"
            });
        }
        const secretHex = process.env.SECRET;
        const secret = Buffer.from((secretHex as string), 'hex');
        const { payload, protectedHeader } = await jwtDecrypt(req.headers.authorization, (secret as any))
        const response = await getStorefrontService.handle(
            (payload.token as string), (payload.entitlements as string), (payload.puuid as string)
        );
        if (response.status === 400) {
            return res.status(500).json({
                "status": 500,
                "message": "Internal server error."
            })
        }
        res.status(response.status).json(response)
    } catch {
        return res.status(401).json({
            "status": 401,
            "message": "Please relogin or reauth cookies."
        })
    }
}