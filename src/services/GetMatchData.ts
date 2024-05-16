import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';
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
            const gameDuration = response.data.matchInfo.gameLengthMillis;
            const gameDurationMinutes = Math.floor(gameDuration / 60000);
            const gamemode = response.data.matchInfo.queueID;
            const players = response.data.players;
            const playerData = [];
            
            for (const player of players) {
                const playerPuuid = player.subject;
                const playerRiotId = player.gameName;
                const playerTagline = player.tagLine;
                const riotId = playerRiotId + "#" + playerTagline;
                const playerTeam = player.teamId;
                const playerCharacter = player.characterId;
                const playerCompetitiveTier = player.competitiveTier;
                const playerKills = player.stats.kills;
                const playerDeaths = player.stats.deaths;
                const playerAssists = player.stats.assists;
            
                playerData.push({
                    puuid: playerPuuid,
                    riotId: riotId,
                    team: playerTeam,
                    tier: playerCompetitiveTier,
                    character: playerCharacter,
                    kills: playerKills,
                    deaths: playerDeaths,
                    assists: playerAssists,
                });
            }
            const teams = response.data.teams;
            const teamData = [];
            for (const team of teams) {
                const teamName = team.teamId;
                const teamScore = team.numPoints;
                const won = team.won;

                teamData.push({
                    name: teamName,
                    score: teamScore,
                    won: won,
                });
            }
            
            return {
                status: response.status,
                matchInfo: {
                    matchId: matchID, 
                    map: mapUrl,
                    gamemode: gamemode,
                    gameDuration: gameDuration,
                    gameDurationMinutes: gameDurationMinutes,
                    players: playerData,
                    teams: teamData
                }
            };
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
