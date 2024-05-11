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
            let matches: { [key: string]: any } = {};

            const matchHistory = await getMatchHistory.handle(token, entitlements, puuid)
            .catch(err => {return err.response});
            for (let i = 1; i <= matchHistory.lenght; i++) {
            
                if(matchHistory === undefined) return {status: 400, message: 'Bad Request - MISSING_MATCHHISTORY',};
            
                const matchKey = `match${i}`;
                if (!matchHistory.matches || !matchHistory.matches[matchKey]) {
                    return {status: 400, message: 'Bad Request - MISSING_MATCHHISTORY',};
                }

                const matchData = await getMatchData.handle(token, entitlements, puuid, matchHistory.matches[matchKey].matchId)
                .catch(err => {return err.response});

                if (matchData === undefined) return {status: 400, message: 'Bad Request - MISSING_MATCHDATA',};

                const agentInfo = await getAgentInfo.handle(matchData.characterId)
                .catch(err => {return err.response});

                const mapInfo = await getMapInfo.handle(matchData.mapUrl)
                .catch(err => {return err.response});

                matches[matchKey] = {
                    matchData: matchData,
                    agentInfo: agentInfo,
                    mapInfo: mapInfo,
                };
            }
    
            return {
                status: 200,
                matches: matches,
            };
        }
        catch (error) {
            console.log(error)
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
