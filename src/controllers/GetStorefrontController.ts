import { Request, Response } from 'express';
import GetStorefrontService from '../services/GetStorefrontService';
const getStorefrontService = new GetStorefrontService();

export const Storefront = async (req: Request, res: Response) => {
    if(!req.cookies.token || !req.cookies.entitlements || !req.cookies.puuid) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "missing body parameters"
        });
    }
    const response = await getStorefrontService.handle(
        req.cookies.token, req.cookies.entitlements, req.cookies.puuid
    );
    if(response.status === 400) {
        return res.status(401).json({
            "status": 401,
            "message": "Please relogin or reauth cookies."
        })
    }
    res.status(response.status).json(response)
}
