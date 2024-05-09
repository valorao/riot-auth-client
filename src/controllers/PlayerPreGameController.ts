import { Request, Response } from 'express';

import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';

const getPlayerPreGameId = new GetPlayerPreGameId();

export const PlayerPreGameId = async (req: Request, res: Response) => {
    try {
        const response = await getPlayerPreGameId.PlayerPreGameId(req.body.token, req.body.puuid,
            req.body.entitlements, req.body.client_platform, req.body.client_version);
        res.status(response.status).json({
            "status": response.status,
            "party_id": response.data.MatchID,
        });
    } catch {
        res.status(400).json({
            "status": 400,
            "message": "Bad Request"
        });
    }
};
