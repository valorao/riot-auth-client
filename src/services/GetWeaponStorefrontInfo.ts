import axios from 'axios';

export default class GetWeaponStorefrontInfo {
    handle = async (uuid: string) => {
        try {
            const url = `http://valorant.api.valorao.cloud/valorant/v1/weapons/storefront?uuid=${uuid}&language=en-US`
            const response  = await axios.get(url)
            if (!response || !response.data || response.status !== 200) {
                return {
                    status: response.status,
                    message: response.data
                }
            }
            const data = response.data.data;
            const weaponuuid = data.uuid;
            const displayName = data.displayName;
            const displayIcon = data.displayIcon;
            const streamedVideo = data.streamedVideo;
            if (!streamedVideo) {
                return {
                    uuid: weaponuuid,
                    displayName: displayName,
                    displayIcon: displayIcon,
                }
            }
    
            return {
                displayName: displayName,
                displayIcon: displayIcon,
                streamedVideo: streamedVideo,
            };
        }
        catch (error) {
            console.log(error)
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
