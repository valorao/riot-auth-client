import { Request, Response } from 'express';

import { GetPlayerParty } from '../middlewares/GetPlayerParty';

const getPlayerParty = new GetPlayerParty();

export const PlayerParty = async (req: Request, res: Response) => {
    try {
        const response = await getPlayerParty.PlayerParty(req.body.token, req.body.puuid,
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
};
