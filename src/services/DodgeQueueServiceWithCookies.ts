import { PlayerDodgeQueue } from '../middlewares/PlayerDodgeQueue';
import { GetPlayerPreGameId } from '../middlewares/GetPlayerPreGameId';
import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';

const playerPreGameId = new GetPlayerPreGameId();
const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();
const playerDodgeQueue = new PlayerDodgeQueue();

export class DodgeQueueServiceWithCookies {
    handle = async(cookies: string) => {

        const cookieArray = cookies.split('; ');

        let token, entitlements, puuid;

        for (let cookie of cookieArray) {
            if (cookie.startsWith('token')) {
                token = cookie.split('=')[1];
            } else if (cookie.startsWith('entitlements')) {
                entitlements = cookie.split('=')[1];
            } else if (cookie.startsWith('puuid')) {
                puuid = cookie.split('=')[1];
            }
        }

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
        
            const game_id =  await playerPreGameId.PlayerPreGameId(
                (token || ''), (puuid || ''), (entitlements || ''), client_platform, clientversion
            );
            const pregame_id = game_id.data.MatchID;
        
            const dodgeresponse = await playerDodgeQueue.DodgeQueue((token || ''), pregame_id,
            (entitlements || ''), client_platform, clientversion).catch(err => {
                    return err.response;
                });

            return dodgeresponse;
        }
    }