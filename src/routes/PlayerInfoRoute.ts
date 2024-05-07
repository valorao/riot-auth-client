import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { GetPlayerParty } from '../middlewares/GetPlayerParty';
import { PlayerDodgeQueue } from '../middlewares/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';
import { DodgeQueueService } from '../services/DodgeQueueService';
import { AuthenticatePlayerService } from '../services/AuthenticatePlayerService';
import { ReauthCookiesService } from '../services/ReauthCookiesService';
import { DodgeQueueServiceWithCookies } from '../services/DodgeQueueServiceWithCookies';

export const player_router = express.Router();
const app = express();
const getPlayerParty = new GetPlayerParty();
const playerDodgeQueue = new PlayerDodgeQueue();
const playerPreGameId = new GetPlayerPreGameId();
const dodgeQueueService = new DodgeQueueService();
const authenticatePlayerService = new AuthenticatePlayerService();
const reauthCookiesService = new ReauthCookiesService();
const dodgeQueueServiceWithCookies = new DodgeQueueServiceWithCookies();
app.use(cookieParser());

player_router.post('/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const response = await dodgeQueueService.handle(req.body.username, req.body.password);
    res.status(response.status).json(response.data);
});

player_router.post('/auth', async (req: Request, res: Response) => {
    const response = await authenticatePlayerService.handle(req.body.username, req.body.password);
    res.status(response.status).header('set-cookie', response.ssid);
    if (response.cookie) {
        const puuidCookie = response.cookie[0];
        res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);
        delete response.cookie;
    }
    res.json(response);
})

player_router.get('/auth/reauth', async (req: Request, res: Response) => {
    const response = await reauthCookiesService.handle(req.headers.cookie || '');
    res.status(response.status).json({
        "status": response.status,
        "token": response.data
    });
})

player_router.get('/auth/reauth/browser', async (req: Request, res: Response) => {
    const response = await authenticatePlayerService.handle('idonaldtrampo', 'IS31971457644?!');
    res.status(response.status);
    if (Array.isArray(response.ssid)) {
        response.ssid.forEach((cookie) => {
            res.cookie(cookie.name, cookie.value, cookie.options);
        });
    }
    res.json(response);
})

player_router.get('/auth/with/cookies/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const puuid_cookie = await req.cookies['puuid']
    const ssid_cookie = await req.cookies['ssid']
    const response = await dodgeQueueServiceWithCookies.handle(ssid_cookie || '', puuid_cookie || '');
    const responseObject = {
        status: response.status,
    };

    res.status(response.status).json(responseObject);
})


player_router.post('/player/party', async (req: Request, res: Response) => {
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
});

player_router.post('/player/pregame', async (req: Request, res: Response) => {
    try {
        const response = await playerPreGameId.PlayerPreGameId(req.body.token, req.body.puuid,
            req.body.entitlements, req.body.client_platform, req.body.client_version);
       res.status(response.status).json({
           "status": response.status,
           "pregame_id": response.data.MatchID,
       });
    } catch {
        res.status(400).json({
            "status": 400,
            "message": "Bad Request"
        });
    
    }
});

player_router.post('/player/pregame/leave', async (req: Request, res: Response) => {
    try {
        const response = await playerDodgeQueue.DodgeQueue(req.body.token, req.body.pregame_id,
            req.body.entitlements, req.body.client_platform, req.body.client_version);
       res.status(response.status).json({
           "status": response.status,
           "party_id": response.data.CurrentPartyID,
       })
    } catch {
        res.status(400).json({
            "status": 400,
            "message": "Bad Request"
        });
    }
});
