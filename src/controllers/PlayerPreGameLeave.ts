import { Request, Response } from 'express';

import { PlayerDodgeQueue } from '../middlewares/PlayerDodgeQueue';

const playerDodgeQueue = new PlayerDodgeQueue();

export const PlayerDodge = async (req: Request, res: Response) => {
    if(!req.body.token || !req.body.pregame_id || !req.body.entitlements || !req.body.client_platform || !req.body.client_version) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "missing body parameters"
        });
    }
    try {
        const response = await playerDodgeQueue.DodgeQueue(req.body.token, req.body.pregame_id,
            req.body.entitlements, req.body.client_platform, req.body.client_version);
            if (response.status != 204){
                return res.status(response.status).json({
                    "status": response.status,
                    "message": response.data
                });
            }
        res.status(response.status).json({
            "status": response.status,
            "party_id": response.data.CurrentPartyID,
        });
    } catch {
        res.status(400).json({
            "status": 400,
            "message": "Bad Request"
        });
    }
}
