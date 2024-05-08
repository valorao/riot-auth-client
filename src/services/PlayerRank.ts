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
        try {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const rankurl = `https://pd.na.a.pvp.net/mmr/v1/players/${puuid}`
        const rankconfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': client_platform,
                'X-Riot-ClientVersion': client_version,
                }
        };

        const rankresponse  = await axios.get(rankurl, rankconfig).catch(err => {return err.response});
        if (!rankresponse || !rankresponse.data || rankresponse.status !== 200) {
            throw rankresponse.data;
        }
        const seasonIDs = Object.keys(rankresponse.data.QueueSkills.competitive.SeasonalInfoBySeasonID);
        const firstSeasonID = seasonIDs[0];
        const rank = rankresponse.data.QueueSkills.competitive.SeasonalInfoBySeasonID[firstSeasonID].Rank;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const nameurl = `https://pd.na.a.pvp.net/name-service/v2/players`
        const nameconfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': client_platform,
                'X-Riot-ClientVersion': client_version,
            }
        }
        const namebody = [
            puuid
        ]

        const nameresponse  = await axios.put(nameurl, namebody, nameconfig).catch(err => {return err.response});
        if (!nameresponse || !nameresponse.data || nameresponse.status !== 200) {
            throw nameresponse.data;
        }
        const riotid = nameresponse.data[0].GameName;
        const tagline = nameresponse.data[0].TagLine;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const ranknameurl = `http://valorant.api.valorao.cloud/valorant/v1/competitive/tiers?tier=${rank}&language=pt-BR`
        const getRankName  = await axios.get(ranknameurl)
        if (!getRankName || !getRankName.data || getRankName.status !== 200) {
            throw getRankName.data;
        }
        const tierID = getRankName.data.latestepisode[0].uuid;
        const tierName = getRankName.data.latestepisode[0].tiers[0].tierName;
        const tierSmallIcon = getRankName.data.latestepisode[0].tiers[0].smallIcon;
        const tierLargeIcon = getRankName.data.latestepisode[0].tiers[0].largeIcon;

        return {
            status: rankresponse.status,
            riotid: riotid,
            tagline: tagline,
            tier: rank,
            tierName: tierName,
            tierSmallIcon: tierSmallIcon,
            tierLargeIcon: tierLargeIcon,
            tierID: tierID
        };
        } catch (err) {
            const errorResponse = {
                status: 500,
                message: (err as Error).message
            };
            return errorResponse;
        }
    }
}