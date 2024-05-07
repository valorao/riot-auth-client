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

player_router.get('/get-cookies', (req, res) => {
    // Access cookies from the request
    const puuid = req.cookies.puuid;
    const otherCookie = req.cookies.ssid;

    // Send cookies in the response
    res.json({ puuid, otherCookie });
});

player_router.delete('/logout', (req, res) => {
    res.clearCookie('puuid');
    res.clearCookie('ssid');
    res.json({ message: 'Cookies cleared' });
})

player_router.post('/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const response = await dodgeQueueService.handle(req.body.username, req.body.password);
    res.status(response.status).json(response.data);
});

player_router.get('/actions/ping', async (req: Request, res: Response) => {
    res.set('Cache-Control', 'no-cache');
    res.status(400).json({
        "status": 200,
        "message": "pong"
    });
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
player_router.get('/auth/browser', async (req: Request, res: Response) => {
    const response = await authenticatePlayerService.handle((req.headers.username as string),
     (req.headers.password as string));
    res.status(response.status)
    if (response.status === 200) {
        res.header('set-cookie', response.ssid);
    }
    if (response.cookie) {
        const puuidCookie = response.cookie[0];
        res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);
        delete response.cookie;
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Headers', 'password,username');
    res.setHeader('Access-Control-Allow-Method', 'GET');
    res.json(response);
})

player_router.options('/auth/browser', async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'username, password');
    res.json({});
})

player_router.get('/auth/reauth', async (req: Request, res: Response) => {
    const response = await reauthCookiesService.handle(req.headers.cookie || '');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (response.data.accessToken === null) {
        res.status(200).json({
            "status": 400,
            "message": "Bad Request"
        })
    }else {
        res.status(response.status).json({
            "status": response.status,
            "token": response.data
        });
    }
})

player_router.get('/auth/with/cookies/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const response = await dodgeQueueServiceWithCookies.handle(req.headers.cookie || '');
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
