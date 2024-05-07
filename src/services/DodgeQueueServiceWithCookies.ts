import express from 'express';

import { PlayerDodgeQueue } from '../middlewares/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';
import { GetClientPlatform } from '../middlewares/GetClientPlatformService';
import { ReauthCookiesService } from './ReauthCookiesService';
import { GetClientVersion } from '../middlewares/GetClientVersionService';
import e from 'express';

export const DodgeQueueRouter = express.Router();
const playerPreGameId = new GetPlayerPreGameId();
const getClientPlatform = new GetClientPlatform();
const reauthCookiesService = new ReauthCookiesService();
const getClientVersion = new GetClientVersion();
const playerDodgeQueue = new PlayerDodgeQueue();

export class DodgeQueueServiceWithCookies {
    handle = async(cookies: string) => {

        const cookieArray = cookies.split('; ');

        let ssid, puuid;

        // Extract the individual cookies
        for (let cookie of cookieArray) {
            if (cookie.startsWith('ssid')) {
                ssid = cookie;
            } else if (cookie.startsWith('puuid')) {
                puuid = cookie.split('=')[1];
            }
        }

        const response = await reauthCookiesService.handle(ssid || '');
        if (!response || !response.data) {
            throw new Error('Failed to authenticate account');
        }
        const accessToken = response.data.accessToken;
        const entitlementsToken = response.data.entitlements;
        const clientPlatform = await getClientPlatform.ClientPlatform();
        if (!clientPlatform || !clientPlatform.data) {
            throw new Error('Failed to get client platform');
        }
        const client_platform = clientPlatform.data.data.platform;
        const version = await getClientVersion.ClientVersion();
        if (!version || !version.data) {
            throw new Error('Failed to get client version');
        }
        const clientversion = version.data.data.version;
        
            const game_id =  await playerPreGameId.PlayerPreGameId((accessToken || ''), (puuid || ''), entitlementsToken, client_platform, clientversion);
            const pregame_id = game_id.data.MatchID;
        
            const dodgeresponse = await playerDodgeQueue.DodgeQueue((accessToken || ''), pregame_id,
                entitlementsToken, client_platform, clientversion).catch(err => {
                    return err.response;
                });

            return dodgeresponse;
        }
    }