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

const cookies = getCookies.postAuthCookies('85.0.1.1382.3124').then(res => {
    res.headers['set-cookie']?.find(cookie => /^asid/.test(cookie));
    
    return res.headers['set-cookie']?.find(cookie => /^asid/.test(cookie));
})

DodgeQueueRouter.post('/actions/player/pregame/leave', async (req: Request, res: Response) => {
    const cookiesValue = await cookies;
    const version = await getClientVersion.ClientVersion(true);
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
    res.status(dodgeresponse.status).json({
        "status": dodgeresponse.status,
    });
});