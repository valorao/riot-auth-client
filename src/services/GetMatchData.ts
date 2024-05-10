import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';
import GetPlayerName from './GetPlayerName';
const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();
const getPlayerName = new GetPlayerName();

export default class GetMatchData {
    handle = async (token: string, entitlements: string, puuid:string, matchID: string) => {
        try {
            const version_response = await getClientVersion.ClientVersion();
            const platform_response = await getClientPlatform.ClientPlatform();
            const version = version_response.data.data.riotClientVersion;
            const platform = platform_response.data.data.platform;
            const getPlayerNameResponse = await getPlayerName.handle(token, entitlements, puuid);
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

            const winData = response.data.teams.find((team: any) => team.teamId === teamId);
            const redTeam = response.data.teams.find((team: any) => team.teamId === 'Red');
            const RedTeamScore = redTeam.numPoints;
            const blueTeam = response.data.teams.find((team: any) => team.teamId === 'Blue');
            const blueTeamScore = blueTeam.numPoints;
            let playerTeamScore;
            if (teamId === 'Red') {
                playerTeamScore = RedTeamScore
            }
            if (teamId === 'Blue') {
                playerTeamScore = blueTeamScore
            }
            const isWinner = winData.won;

            const playerKills = playerData.stats.kills
            const playerDeaths = playerData.stats.deaths
            const playerAssists = playerData.stats.assists
            const playerRiotId = getPlayerNameResponse.riotid;
            const playerTagline = getPlayerNameResponse.tagline;
            const riotId = playerRiotId + "#" + playerTagline;

            return {
                status: response.status,
                message: "showing only last match",
                subject: puuid,
                riotId: riotId,
                stats: {
                    kills: playerKills,
                    deaths: playerDeaths,
                    assists: playerAssists,
                },
                mapUrl: mapUrl,
                characterId: characterId,
                teamId: teamId,
                teamIsWinner: isWinner,
                score: {
                    playerTeamScore: playerTeamScore,
                    blueTeamScore: blueTeamScore,
                    RedTeamScore: RedTeamScore,
                },
            }
        }
        catch (error) {
            console.log(error)
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
