import axios from 'axios';

export default class GetMapInfo {
    handle = async (mapUrl?: string, mapName?: string) => {
        try {
            const url = `https://valorant-api.com/v1/maps`
            const findmap = await axios.get(url)
            if (!findmap || !findmap.data || findmap.status !== 200) {
                return { status: 400, message: 'Bad Request', error: findmap.data };
            }
            if (mapUrl) {
                const findMapId = findmap.data.data.find((map: any) => map.mapUrl === mapUrl);
                if (!findMapId) {
                    return { status: 404, message: 'Map not found' };
                }
                const mapName = findMapId.displayName;
                const mapListViewIcon = findMapId.listViewIcon;
                const mapSplash = findMapId.splash;
                const mapUuid = findMapId.uuid;

                return {
                    status: 200,
                    mapUuid: mapUuid,
                    mapName: mapName,
                    mapListViewIcon: mapListViewIcon,
                    mapSplash: mapSplash
                };
            } if (mapName) {
                const findMapId = findmap.data.data.find((map: any) => map.displayName === mapName);
                if (!findMapId) {
                    return { status: 404, message: 'Map not found' };
                }
                const mapDisplayName = findMapId.displayName;
                const mapListViewIcon = findMapId.listViewIcon;
                const mapSplash = findMapId.splash;
                const mapUuid = findMapId.uuid;

                return {
                    status: 200,
                    mapUuid: mapUuid,
                    mapName: mapDisplayName,
                    mapListViewIcon: mapListViewIcon,
                    mapSplash: mapSplash
                };
            }
            return { status: 400, message: 'Bad Request', };
        }
        catch (error) {
            console.log(error)
            return { status: 500, message: 'Internal Server Error', error };
        }
    }
}
