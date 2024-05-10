import axios from 'axios';

export default class GetMapInfo {
    handle = async (mapUrl: string) => {
        try {
            const url = `https://valorant-api.com/v1/maps`
            const findmap  = await axios.get(url)
            if (!findmap || !findmap.data || findmap.status !== 200) {
                throw findmap.data;
            }
            const findMapId = findmap.data.data.find((map: any) => map.mapUrl === mapUrl);
            const mapName = findMapId.displayName;
            const mapListViewIcon = findMapId.listViewIcon;
            const mapSplash = findMapId.splash;
            const mapUuid = findMapId.uuid;
    
            return {
                mapUuid: mapUuid,
                mapName: mapName,
                mapListViewIcon: mapListViewIcon,
                mapSplash: mapSplash
            };
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
