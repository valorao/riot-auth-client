import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();

export default class GetPlayerRank {
    handle = async (token: string, entitlements: string, puuid: string) => {
        const version_response = await getClientVersion.ClientVersion();
        const platform_response = await getClientPlatform.ClientPlatform();
        const version = version_response.data.data.riotClientVersion;
        const platform = platform_response.data.data.platform;

        const rankurl = `https://pd.na.a.pvp.net/mmr/v1/players/${puuid}`
        const rankconfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': platform,
                'X-Riot-ClientVersion': version,
                }
        };

        const rankresponse  = await axios.get(rankurl, rankconfig).catch(err => {return err.response});
        if (rankresponse.status !== 200) {
            return {
                status : rankresponse.status,
                message: rankresponse.data,
            }
        }
        let rank: number;
        const rankData = rankresponse.data.QueueSkills.competitive.SeasonalInfoBySeasonID;
        if (!rankData) {
            rank = 0;
        } else {
            const seasonIDs = Object.keys(rankData);
            if(seasonIDs.length === 0) {
                rank = 0;
            } else {
                const firstSeasonID = seasonIDs[0];
                rank = rankData[firstSeasonID].Rank;
            }
        }
        return rank;
    }
}
