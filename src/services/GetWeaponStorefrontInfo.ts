import axios from 'axios';

export default class GetWeaponStorefrontInfo {
    handle = async (uuid: string) => {
        try {
            const url = `https://valorant-api.com/v1/weapons/skinlevels/${uuid}?language=pt-BR`
            const response = await axios.get(url)
            if (!response || !response.data || response.status !== 200) {
                return {
                    status: response.status,
                    message: response.data
                }
            }
            const skinsurl = `https://valorant-api.com/v1/weapons/skins?language=pt-BR`
            const skinsresponse = await axios.get(skinsurl)
            const data = response.data.data;
            const findSkin = skinsresponse.data.data.find((skin: any) => skin.displayName === data.displayName)
            const skinTierurl = `https://valorant-api.com/v1/contenttiers?language=pt-BR`
            const skinTierresponse = await axios.get(skinTierurl)
            const skinTier = skinTierresponse.data.data.find((tier: any) => tier.uuid === findSkin.contentTierUuid)
            const weaponuuid = data.uuid;
            const displayName = data.displayName;
            const displayIcon = findSkin.displayIcon;
            const streamedVideo = data.streamedVideo;
            if (!streamedVideo) {
                return {
                    uuid: weaponuuid,
                    displayName: displayName,
                    displayIcon: displayIcon,
                    contentTierInfo: skinTier,
                    detailedInfo: findSkin,
                }
            }

            return {
                displayName: displayName,
                displayIcon: displayIcon,
                streamedVideo: streamedVideo,
                contentTierInfo: skinTier,
                detailedInfo: findSkin,
            };
        }
        catch (error) {
            console.log(error)
            return { status: 500, message: 'Internal Server Error', };
        }
    }
}
