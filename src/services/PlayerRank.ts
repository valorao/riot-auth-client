import GetPlayerRank from './GetPlayerRank';
import GetPlayerName from './GetPlayerName';
import GetPlayerBanner from './GetPlayerBanner';
import GetBannerImg from './GetBannerImg';
import GetTierInfo from './GetTierInfo';
const getPlayerRank = new GetPlayerRank();
const getPlayerName = new GetPlayerName();
const getPlayerBanner = new GetPlayerBanner();
const getBannerImg = new GetBannerImg();
const getTierInfo = new GetTierInfo();


export default class GetPlayerRankandInfo {
    handle = async (token: string, entitlements: string, puuid: string) => {
        try {
            if (!token || !entitlements || !puuid) {
                return { status: 403, message: 'Missing required parameters', };
            }
            const player_rank = await getPlayerRank.handle(token, entitlements, puuid)
                .catch(err => { return err.response });

            const player_name = await getPlayerName.handle(token, entitlements, puuid)
                .catch(err => { return err.response });

            const player_banner = await getPlayerBanner.handle(token, entitlements, puuid)
                .catch(err => { return err.response });

            const player_banner_img = await getBannerImg.handle(player_banner.playerbanner)
                .catch(err => { return err.response });

            const tier_info = await getTierInfo.handle(player_rank)
                .catch(err => { return err.response });

            return {
                status: 200,
                riotid: player_name.riotid,
                tagline: player_name.tagline,
                tier: player_rank,
                tierName: tier_info.tierName,
                tierID: tier_info.tierID,
                tierSmallIcon: tier_info.tierSmallIcon,
                tierLargeIcon: tier_info.tierLargeIcon,
                bannerimg: player_banner_img.bannerimg,
            };
        }
        catch (error) {
            return { status: 500, message: 'Internal Server Error', };
        }
    }
}
