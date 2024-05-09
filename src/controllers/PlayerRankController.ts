import { Request, Response } from 'express';
import GetPlayerRankandInfo from '../services/playerRank';
const getPlayerRankandInfo = new GetPlayerRankandInfo();

export const GetPlayerRank = async (req: Request, res: Response) => {
    const response = await getPlayerRankandInfo.handle(
        req.cookies.token, req.cookies.entitlements, req.cookies.puuid
    );
    res.status(response.status).json(response)
}