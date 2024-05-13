import { Request, Response } from 'express';
import GetPlayerName from '../services/GetPlayerName';

const getPlayerName = new GetPlayerName();

export const GetBrowserCookies = async (req: Request, res: Response) => {
    const puuid = req.cookies.puuid;
    const ssid = req.cookies.ssid;
    const token = req.cookies.token;
    const entitlements = req.cookies.entitlements;
    if (!puuid || !ssid || !token || !entitlements || puuid === undefined || ssid === undefined || token === undefined || entitlements === undefined) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "Cookies not found"
        });
    }
    if (puuid && ssid && token && entitlements) {
        try {
            const player_name = await getPlayerName.handle(token, entitlements, puuid)
            const status = player_name.status;
            if(status === 403 || status === 401 || status === 400) {
                return res.status(403).json({
                    "status": 403,
                    "error": "Forbidden",
                    "message": "Invalid cookies"
                });
            }

            if(status === 200) {
                return res.status(200).json({ puuid, ssid, token, entitlements });
            }
            
        }
        catch (error) {
            return res.status(500).json({
                "status": 500,
                "error": "Internal Server Error",
                "message": "Internal Server Error"
            });
        }
    }
}