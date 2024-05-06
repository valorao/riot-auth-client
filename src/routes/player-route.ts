import express, { Request, Response } from 'express';
import { GetPlayerParty } from '../middlewares/GetPlayerParty';
import { PlayerDodgeQueue } from '../services/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';

export const player_router = express.Router();
const getPlayerParty = new GetPlayerParty();
const playerDodgeQueue = new PlayerDodgeQueue();
const playerPreGameId = new GetPlayerPreGameId();

player_router.post('/player/party', async (req: Request, res: Response) => {
    const response = await getPlayerParty.PlayerParty(req.body.token, req.body.puuid,
         req.body.entitlements, req.body.client_platform, req.body.client_version);
    res.status(response.status).json({
        "status": response.status,
        "party_id": response.data.CurrentPartyID,
    });
});

player_router.post('/player/pregame', async (req: Request, res: Response) => {
    const response = await playerPreGameId.PlayerPreGameId(req.body.token, req.body.puuid,
         req.body.entitlements, req.body.client_platform, req.body.client_version);
    res.status(response.status).json({
        "status": response.status,
        "pregame_id": response.data.MatchID,
    });
});

player_router.post('/player/pregame/leave', async (req: Request, res: Response) => {
    const response = await playerDodgeQueue.DodgeQueue(req.body.token, req.body.pregame_id,
         req.body.entitlements, req.body.client_platform, req.body.client_version);
    res.status(response.status).json({
        "status": response.status,
        "party_id": response.data.CurrentPartyID,
    });
});
