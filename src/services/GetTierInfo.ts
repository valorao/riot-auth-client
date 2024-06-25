import axios from 'axios';

interface Tier {
    tier: number;
    tierID: string;
    tierName: string;
    tierSmallIcon: string;
    tierLargeIcon: string;
}

export default class GetTierInfo {
    handle = async (rank: number) => {
        try {
            const ranknameurl = `https://valorant-api.com/v1/competitivetiers?language=pt-BR`;
            const getRankName = await axios.get(ranknameurl);

            if (!getRankName || !getRankName.data || getRankName.status !== 200) {
                return {
                    status: getRankName.status,
                    message: getRankName.data
                };
            }

            const episodeIndex = getRankName.data.data.length;
            const episodeData = getRankName.data.data[episodeIndex - 1];
            const rankInfo = episodeData.tiers.find((tierData: Tier) => tierData.tier === rank);
            if (!rankInfo) {
                return {
                    status: 404,
                    message: `Tier with rank number ${rank} not found.`
                };
            }
            const tierID = episodeData.uuid;
            const tierName = rankInfo.tierName;
            const tierSmallIcon = rankInfo.smallIcon;
            const tierLargeIcon = rankInfo.largeIcon;
            return {
                tierID: tierID,
                tierName: tierName,
                tierSmallIcon: tierSmallIcon,
                tierLargeIcon: tierLargeIcon
            };
        } catch (error) {
            console.error('Error fetching tier info:', error);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
}
