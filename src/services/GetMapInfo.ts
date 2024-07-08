import axios from 'axios';

export default class GetMapInfo {
    handle = async (mapUrl: string, mapName?: string) => {
        try {
            const url = `https://valorant-api.com/v1/maps`
            const findmap = await axios.get(url)
            if (!findmap || !findmap.data || findmap.status !== 200) {
                throw findmap.data;
            }
            if (mapUrl) {
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
            } else if (mapName) {
                const findMapId = findmap.data.data.find((map: any) => map.displayName === mapName);
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
            return { status: 400, message: 'Bad Request', };
        }
        catch (error) {
            return { status: 500, message: 'Internal Server Error', };
        }
    }
}
