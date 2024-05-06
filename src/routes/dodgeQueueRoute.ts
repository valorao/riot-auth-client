import express, { Request, Response} from 'express';

import { PlayerDodgeQueue } from '../services/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';

export const DodgeQueueRouter = express.Router();
const playerDodgeQueue = new PlayerDodgeQueue();
const playerPreGameId = new GetPlayerPreGameId();

DodgeQueueRouter.post('/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const game_id =  await playerPreGameId.PlayerPreGameId(req.body.token, req.body.puuid, req.body.entitlements, req.body.client_platform, req.body.client_version);
    const pregame_id = game_id.data.MatchID;

    const response = await playerDodgeQueue.DodgeQueue(req.body.token, pregame_id,
         req.body.entitlements, req.body.client_platform, req.body.client_version);
    res.status(response.status).json({
        "status": response.status,
    });
});