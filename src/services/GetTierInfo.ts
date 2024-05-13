import axios from 'axios';

export default class GetTierInfo {
    handle = async (rank: number) => {
        try {
            const ranknameurl = `https://apis.valorao.cloud/data/competitive/tiers?tier=${rank}&language=en-US`
            const getRankName  = await axios.get(ranknameurl)
            if (!getRankName || !getRankName.data || getRankName.status !== 200) {
                return {
                    status: getRankName.status,
                    message: getRankName.data
                }
            }
            const tierID = getRankName.data.latestepisode[0].uuid;
            const tierName = getRankName.data.latestepisode[0].tiers[0].tierName;
            const tierSmallIcon = getRankName.data.latestepisode[0].tiers[0].smallIcon;
            const tierLargeIcon = getRankName.data.latestepisode[0].tiers[0].largeIcon;
    
            return {
                tierID: tierID,
                tierName: tierName,
                tierSmallIcon: tierSmallIcon,
                tierLargeIcon: tierLargeIcon
            };
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
