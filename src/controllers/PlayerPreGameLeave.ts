import { Request, Response } from 'express';

import { PlayerDodgeQueue } from '../middlewares/PlayerDodgeQueue';

const playerDodgeQueue = new PlayerDodgeQueue();

export const PlayerDodge = async (req: Request, res: Response) => {
    try {
        const response = await playerDodgeQueue.DodgeQueue(req.body.token, req.body.pregame_id,
            req.body.entitlements, req.body.client_platform, req.body.client_version);
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
