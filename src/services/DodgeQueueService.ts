import express, { Request, Response} from 'express';

import { PlayerDodgeQueue } from '../middlewares/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';
import { GetClientVersion } from '../middlewares/GetClientVersionService';
import { AuthAccount } from '../middlewares/authAccount';
import { GetEntitlements } from '../middlewares/getEntitlements';
import { GetPlayerInfo } from '../middlewares/PlayerInfo';
import { GetClientPlatform } from '../middlewares/GetClientPlatformService';
import { CreateCookie } from '../services/CreateCookie';

export const DodgeQueueRouter = express.Router();
const playerDodgeQueue = new PlayerDodgeQueue();
const playerPreGameId = new GetPlayerPreGameId();
const getClientVersion = new GetClientVersion();
const authAccount = new AuthAccount();
const getEntitlements = new GetEntitlements();
const getPlayerInfo = new GetPlayerInfo();
const getClientPlatform = new GetClientPlatform();
const createCookie = new CreateCookie();

export class DodgeQueueService {
    public async handle(username: string, password: string) {
            const cookiesValue = await createCookie.handle();
            const version = await getClientVersion.ClientVersion();
            const clientversion = version.data.data.version;
            const response = await authAccount.AuthCookies(
                clientversion , username, password, cookiesValue || '');

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
                entitlements_token, client_platform, clientversion).catch(err => {
                    return err.response;
                });

            return dodgeresponse;
        }
    }