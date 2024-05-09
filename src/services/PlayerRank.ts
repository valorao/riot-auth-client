import axios from "axios";
import { GetClientVersion } from "./GetClientVersionService";
import { GetClientPlatform } from "./GetClientPlatformService";
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
        const bannerurl = `https://pd.na.a.pvp.net/personalization/v2/players/${puuid}/playerloadout`
        const bannerconfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': client_platform,
                'X-Riot-ClientVersion': client_version,
            }
        }
        const bannerresponse  = await axios.get(bannerurl, bannerconfig).catch(err => {return err.response});
        if (!bannerresponse || !bannerresponse.data || bannerresponse.status !== 200) {
            throw bannerresponse.data;
        }
        const banner = bannerresponse.data.Identity.PlayerCardID;
        const title = bannerresponse.data.Identity.PlayerTitleID;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const ranknameurl = `http://valorant.api.valorao.cloud/valorant/v1/competitive/tiers?tier=${rank}&language=en-US`
        const getRankName  = await axios.get(ranknameurl)
        if (!getRankName || !getRankName.data || getRankName.status !== 200) {
            throw getRankName.data;
        }
        const tierID = getRankName.data.latestepisode[0].uuid;
        const tierName = getRankName.data.latestepisode[0].tiers[0].tierName;
        const tierSmallIcon = getRankName.data.latestepisode[0].tiers[0].smallIcon;
        const tierLargeIcon = getRankName.data.latestepisode[0].tiers[0].largeIcon;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const bannerimg = `https://valorant-api.com/v1/playercards/${banner}?language=en-US`
        const getbannerimg  = await axios.get(bannerimg)
        if (!getbannerimg || !getbannerimg.data || getbannerimg.status !== 200) {
            throw getbannerimg.data;
        }
        const bannerwideimg = getbannerimg.data.data.wideArt;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (title === '00000000-0000-0000-0000-000000000000') {
            return {
                status: rankresponse.status,
                riotid: riotid,
                tagline: tagline,
                tier: rank,
                tierName: tierName,
                tierSmallIcon: tierSmallIcon,
                tierLargeIcon: tierLargeIcon,
                bannerimg: bannerwideimg,
                tierID: tierID
            };
        }
        const playertitle = `https://valorant-api.com/v1/playertitles/${title}?language=en-US`
        const nametitle  = await axios.get(playertitle)
        if (!nametitle || !nametitle.data || nametitle.status !== 200) {
            throw nametitle.data;
        }
        const titletext = nametitle.data.data.titleText;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        return {
            status: rankresponse.status,
            riotid: riotid,
            tagline: tagline,
            tier: rank,
            tierName: tierName,
            tierSmallIcon: tierSmallIcon,
            tierLargeIcon: tierLargeIcon,
            bannerimg: bannerwideimg,
            title: titletext,
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