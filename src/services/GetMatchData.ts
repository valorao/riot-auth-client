import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';
import { match } from 'assert';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();

export default class GetMatchData {
    handle = async (token: string, entitlements: string, puuid:string, matchID: string) => {
        try {
            const version_response = await getClientVersion.ClientVersion();
            const platform_response = await getClientPlatform.ClientPlatform();
            const version = version_response.data.data.riotClientVersion;
            const platform = platform_response.data.data.platform;
            const url = `https://pd.na.a.pvp.net/match-details/v1/matches/${matchID}`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Riot-Entitlements-JWT': entitlements,
                    'X-Riot-ClientPlatform': platform,
                    'X-Riot-ClientVersion': version,
                }
            }
            const response  = await axios.get(url, config).catch(err => {return err.response});
            if (response.status === 404) {
                return {
                    status: 404,
                    message: "Match not found",
                }
            }
            if (!response || !response.data || response.status !== 200) {
                return {
                    status : response.status,
                    message: response.data,
                }
    
            }
            const mapUrl = response.data.matchInfo.mapId;

            const playerData = response.data.players.find((player: any) => player.subject === puuid);
            const characterId = playerData.characterId;
            const teamId = playerData.teamId;

            const WinData = response.data.teams.find((team: any) => team.teamId === teamId);
            const isWinner = WinData.won;
            // console.log(characterId, teamId, mapId, isWinner)
            return {
                status: response.status,
                message: "showing only last match",
                mapUrl: mapUrl,
                characterId: characterId,
                teamId: teamId,
                teamIsWinner: isWinner,
            }
        }
        catch (error) {
            console.log(error)
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
