import GetMatchHistory from './GetMatchHistory';
import GetMatchData from './GetMatchData';
import GetAgentInfo from './GetAgentInfo';
import GetMapInfo from './GetMapInfo';
const getMatchHistory = new GetMatchHistory();
const getMatchData = new GetMatchData();
const getAgentInfo = new GetAgentInfo();
const getMapInfo = new GetMapInfo();


export default class GetLastMatches {
    handle = async (token: string, entitlements: string, puuid: string) => {
        try {
            if( !token || !entitlements || !puuid) {
                return {status: 403, message: 'Missing required parameters',};}

            const matchHistory = await getMatchHistory.handle(token, entitlements, puuid)
            .catch(err => {return err.response});
            if(matchHistory === undefined) return {status: 400, message: 'Bad Request - MISSING_MATCHHISTORY',};
            const matchData = await getMatchData.handle(token, entitlements, puuid, matchHistory.lastMatch)
            .catch(err => {return err.response});
            if (matchData === undefined) return {status: 400, message: 'Bad Request - MISSING_MATCHDATA',};
    
            const agentInfo = await getAgentInfo.handle(matchData.characterId)
            .catch(err => {return err.response});
    
            const mapInfo = await getMapInfo.handle(matchData.mapUrl)
            .catch(err => {return err.response});
    
            const matchId = matchHistory.lastMatch
            const matchDate = matchHistory.lastMatchDate
            const teamId = matchData.teamId
            const teamIsWinner = matchData.teamIsWinner
    
            return {
                status: 200,
                match1: {
                    matchId: matchId,
                    matchDate: matchDate,
                    matchDurationMilis: matchData.gameDurationMilis,
                    matchDurationMinutes: matchData.gameDurationMinutes,
                    subject: puuid,
                    riotId: matchData.riotId,
                    stats: matchData.stats,
                    agentInfo: agentInfo,
                    mapInfo: mapInfo,
                    teamId: teamId,
                    teamIsWinner: teamIsWinner,
                    score: matchData.score,
                }

            };
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
