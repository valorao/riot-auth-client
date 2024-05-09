import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { GetPlayerParty } from '../middlewares/GetPlayerParty';
import { PlayerDodgeQueue } from '../middlewares/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';
import { DodgeQueueService } from '../services/DodgeQueueService';
import { AuthenticatePlayerService } from '../services/AuthenticatePlayerService';
import { ReauthCookiesService } from '../services/ReauthCookiesService';
import { DodgeQueueServiceWithCookies } from '../services/DodgeQueueServiceWithCookies';
import { GetPlayerInfo } from '../middlewares/PlayerInfo';
import { GetCookies } from '../middlewares/getCookies';
import GetPlayerRankandInfo from '../services/playerRank';

export const player_router = express.Router();
const app = express();
const getPlayerParty = new GetPlayerParty();
const playerDodgeQueue = new PlayerDodgeQueue();
const playerPreGameId = new GetPlayerPreGameId();
const dodgeQueueService = new DodgeQueueService();
const authenticatePlayerService = new AuthenticatePlayerService();
const reauthCookiesService = new ReauthCookiesService();
const dodgeQueueServiceWithCookies = new DodgeQueueServiceWithCookies();
const getPlayerInfo = new GetPlayerInfo();
const getCookies = new GetCookies();
const getPlayerRankandInfo = new GetPlayerRankandInfo();

app.use(cookieParser());

player_router.get('/actions/player/rank', async (req: Request, res: Response) => {
    const response = await getPlayerRankandInfo.handle(
        req.cookies.token, req.cookies.entitlements, req.cookies.puuid
    );
    res.status(200).json(response);
});


player_router.get('/actions/cookies/generate', async (req: Request, res: Response) => {
    const response = await getCookies.postAuthCookies();
    const cookies = response.headers['set-cookie'];
    const asidCookie = cookies.filter((cookie: string) => cookie.startsWith('asid='));
    res.status(response.status).json({cookie: asidCookie})
})

player_router.get('/fromstatic/cookies', (req, res) => {
    const puuid = req.cookies.puuid;
    const ssid = req.cookies.ssid;
    const token = req.cookies.token;
    const entitlements = req.cookies.entitlements;

    res.json({ puuid, ssid, token, entitlements});
});

player_router.delete('/fromstatic/logout', (req, res) => {
    res.clearCookie('puuid');
    res.clearCookie('ssid');
    res.clearCookie('token');
    res.clearCookie('entitlements');
    res.status(200).json({ message: 'Cookies cleared' });
})

player_router.post('/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const response = await dodgeQueueService.handle(req.body.username, req.body.password);
    res.status(response.status).json(response.data);
});

player_router.get('/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const response = await dodgeQueueServiceWithCookies.handle(req.headers.cookie || '');
    const responseObject = {
        status: response.status,
    };

    res.status(response.status).json(responseObject);
})

player_router.get('/actions/ping', async (req: Request, res: Response) => {
    res.set('Cache-Control', 'no-cache');
    res.status(400).json({
        "status": 200,
        "message": "pong"
    });
});

player_router.get('/player/riotid', async (req: Request, res: Response) => {
    const response = await getPlayerInfo.PlayerInfo(req.headers.cookie || '');
    res.status(400).json({
        "status": 200,
        "message": "pong"
    });
});

player_router.post('/auth', async (req: Request, res: Response) => {
    const response = await authenticatePlayerService.handle(req.body.username, req.body.password);

    res.status(response.status)
    if (response.status === 200) {
        if (req.body.remember === 'true') {
            const puuidCookie = response.cookie[0];
            res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);

            const ssidCookie = response.ssid[0];
            res.cookie(ssidCookie.name, ssidCookie.value, ssidCookie.options);

            const token = response.bearertoken[0];
            res.cookie(token.name, token.value, token.options);

            const entitlements = response.entitlements[0];
            res.cookie(entitlements.name, entitlements.value, entitlements.options);
        }

        if (req.body.remember === 'false' || req.body.remember === undefined) {
            const puuidCookie = response.puuid_onetime[0];
            res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);
            
            const ssidCookie = response.ssid_onetime[0];
            res.cookie(ssidCookie.name, ssidCookie.value, ssidCookie.options);

            const token = response.bearertoken_onetime[0];
            res.cookie(token.name, token.value, token.options);

            const entitlements = response.entitlements_onetime[0];
            res.cookie(entitlements.name, entitlements.value, entitlements.options);
        }
    }

    delete response.cookie;
    delete response.bearertoken;
    delete response.bearertoken_onetime;
    delete response.entitlements;
    delete response.entitlements_onetime;
    delete response.puuid;
    delete response.puuid_onetime;
    delete response.ssid;
    delete response.ssid_onetime;

    res.json(response);
})

player_router.post('/auth/browser', async (req: Request, res: Response) => {
    const response = await authenticatePlayerService.handle(
        (req.body.username as string),
        (req.body.password as string)
    );
    
    res.status(response.status)
    if (response.status === 403) {
        res.status(403).json({
            "status": 403,
            "message": "Multifactor authentication required"
        });
    }
    else if (response.status === 200) {
        if (req.body.remember === 'true') {
            const puuidCookie = response.cookie[0];
            res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);

            const ssidCookie = response.ssid[0];
            res.cookie(ssidCookie.name, ssidCookie.value, ssidCookie.options);

            const token = response.bearertoken[0];
            res.cookie(token.name, token.value, token.options);

            const entitlements = response.entitlements[0];
            res.cookie(entitlements.name, entitlements.value, entitlements.options);
        }

        if (req.body.remember === 'false' || req.body.remember === undefined) {
            const puuidCookie = response.puuid_onetime[0];
            res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);
            
            const ssidCookie = response.ssid_onetime[0];
            res.cookie(ssidCookie.name, ssidCookie.value, ssidCookie.options);

            const token = response.bearertoken_onetime[0];
            res.cookie(token.name, token.value, token.options);

            const entitlements = response.entitlements_onetime[0];
            res.cookie(entitlements.name, entitlements.value, entitlements.options);
        }
        delete response.cookie;
        delete response.bearertoken;
        delete response.bearertoken_onetime;
        delete response.entitlements;
        delete response.entitlements_onetime;
        delete response.puuid;
        delete response.puuid_onetime;
        delete response.ssid;
        delete response.ssid_onetime;

        res.json(response);
    }

    else if (response.status === 400) {
        res.status(400).json({
            "status": 400,
            "message": "Bad Request"
        });
    }
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
        res.clearCookie('token');
        res.clearCookie('entitlements');
        res.cookie('token', response.data.accessToken, {
            maxAge: 60 * 60 * 24 * 7 * 1000,
            httpOnly: true,
        });
        res.cookie('entitlements', response.data.entitlements, {
            maxAge: 60 * 60 * 24 * 7 * 1000,
            httpOnly: true,
        });
        res.status(response.status).json({
            "status": response.status,
            "token": response.data
        });
    }
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
