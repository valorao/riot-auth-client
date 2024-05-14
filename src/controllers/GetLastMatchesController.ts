import { Request, Response } from 'express';
import GetLastMatches from '../services/GetLastMatchesService';
const getLastMatches = new GetLastMatches();

export const LastMatches = async (req: Request, res: Response) => {
    if(!req.cookies.token || !req.cookies.entitlements || !req.cookies.puuid) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "missing body parameters"
        });
    }
    const response = await getLastMatches.handle(
        req.cookies.token, req.cookies.entitlements, req.cookies.puuid
    );

    if(response.status === 400 || Object.keys(response).length === 0) {
        return res.status(401).json({
            "status": 401,
            "message": "Please relogin or reauth cookies.",
            "error": response.message
        })
    }
    res.status(response.status).json(response)
}
