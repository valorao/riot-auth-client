import axios from 'axios';

export class GetPlayerRank {
    handle = async (token: string, entitlements: string, puuid: string, version: string, platform: string) => {
        const rankurl = `https://pd.na.a.pvp.net/mmr/v1/players/${puuid}`
        const rankconfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': version,
                'X-Riot-ClientVersion': platform,
                }
        };

        const rankresponse  = await axios.get(rankurl, rankconfig).catch(err => {return err.response});
        if (!rankresponse || !rankresponse.data || rankresponse.status !== 200) {
            throw rankresponse.data;
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
