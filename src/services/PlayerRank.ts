import axios from "axios";
import { GetClientVersion } from "../middlewares/GetClientVersionService";
import { GetClientPlatform } from "../middlewares/GetClientPlatformService";

const getClientVersion = new GetClientVersion();
const getClientPlatform = new GetClientPlatform();

export class GetPlayerRank { 
    handle = async (token: string, entitlements: string, puuid: string) => {
        const getclient_version = await getClientVersion.ClientVersion();
        const client_version = getclient_version.data.data.riotClientVersion;

        const getclient_platform = await getClientPlatform.ClientPlatform();
        const client_platform = getclient_platform.data.data.platform;

        const url = `https://pd.na.a.pvp.net/mmr/v1/players/${puuid}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': client_platform,
                'X-Riot-ClientVersion': client_version,
                }
        };

        const response  = await axios.get(url, config).catch(err => {return err.response});
        if (!response || !response.data) {
            throw new Error('Invalid response');
        }
        const seasonIDs = Object.keys(response.data.QueueSkills.competitive.SeasonalInfoBySeasonID);
        const firstSeasonID = seasonIDs[0];
        const rank = response.data.QueueSkills.competitive.SeasonalInfoBySeasonID[firstSeasonID].Rank;

        const getRankName  = await axios.get(`http://valorant.api.valorao.cloud/valorant/v1/competitive/tiers?tier=${rank}&language=pt-BR`)
        if (!getRankName || !getRankName.data) {
            throw new Error('Invalid response');
        }
        const tierID = getRankName.data.latestepisode[0].uuid;
        const tierName = getRankName.data.latestepisode[0].tiers[0].tierName;
        const tierSmallIcon = getRankName.data.latestepisode[0].tiers[0].smallIcon;
        const tierLargeIcon = getRankName.data.latestepisode[0].tiers[0].largeIcon;

        return {
            status: response.status,
            tier: rank,
            tierName: tierName,
            tierSmallIcon: tierSmallIcon,
            tierLargeIcon: tierLargeIcon,
            tierID: tierID
        };
    }
}