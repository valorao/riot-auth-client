import express, { Request, Response} from 'express';

import { PlayerDodgeQueue } from '../services/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';
import { GetCookies } from '../middlewares/getCookies';
import { GetClientVersion } from '../middlewares/GetClientVersionService';
import { AuthAccount } from '../middlewares/authAccount';
import { GetEntitlements } from '../middlewares/getEntitlements';
import { GetPlayerInfo } from '../middlewares/PlayerInfo';
import { GetClientPlatform } from '../middlewares/GetClientPlatformService';

export const DodgeQueueRouter = express.Router();
const playerDodgeQueue = new PlayerDodgeQueue();
const playerPreGameId = new GetPlayerPreGameId();
const getCookies = new GetCookies();
const getClientVersion = new GetClientVersion();
const authAccount = new AuthAccount();
const getEntitlements = new GetEntitlements();
const getPlayerInfo = new GetPlayerInfo();
const getClientPlatform = new GetClientPlatform();

const cookies = getCookies.postAuthCookies().then(res => {
    res.headers['set-cookie']?.find((cookie: string) => /^asid/.test(cookie));
    
    return res.headers['set-cookie']?.find((cookie: string) => /^asid/.test(cookie));
})

DodgeQueueRouter.post('/actions/player/pregame/leave', async (req: Request, res: Response) => {
    try {
        const cookiesValue = await cookies;
        const version = await getClientVersion.ClientVersion();
        const clientversion = version.data.data.version;
        const response = await authAccount.AuthCookies(
            clientversion , req.body.username, req.body.password, cookiesValue || '');
        const uri = response.data.response.parameters.uri;
        const url = new URL(uri);
        const params = new URLSearchParams(url.search);
        const token = params.get('access_token');
    
        const ent = await getEntitlements.Entitlements(token || '');
        const entitlements_token = ent.data.entitlements_token;
        
        const info = await getPlayerInfo.PlayerInfo(token || '');
        const puuid = info.data.sub;
    
        const clientPlatform = await getClientPlatform.ClientPlatform()
        const client_platform = clientPlatform.data.data.platform;
    
        const game_id =  await playerPreGameId.PlayerPreGameId((token || ''), puuid, entitlements_token, client_platform, clientversion);
        const pregame_id = game_id.data.MatchID;
    
        const dodgeresponse = await playerDodgeQueue.DodgeQueue((token || ''), pregame_id,
             entitlements_token, client_platform, clientversion);
        res.status(200).json({
            "status": 200,
            "message": "Going back to lobby."
        });
    } catch (error) {
        if(!req.body.username || !req.body.password) {
            return res.status(400).json({
                "status": 400,
                "message": "Missing username or password"
            });
        }
         else {
            return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            });
        }
    }
});