import axios from "axios";
import { GetClientVersion } from "../middlewares/GetClientVersionService";
import { GetClientPlatform } from "../middlewares/GetClientPlatformService";

const getClientVersion = new GetClientVersion();
const getClientPlatform = new GetClientPlatform();

export class GetPlayerRank {
    handle = async (tier: number) => {
        let response  = await axios.get(`http://valorant.api.valorao.cloud/valorant/v1/competitive/tiers?tier=${tier}&language=pt-BR`)
        .then(res => {
            return res
        }).catch(err => {
            return err.response
        });
        return response;
    }
    
    rank = async ( token: string, entitlements: string, puuid: string) => {
        const getclient_version = await getClientVersion.ClientVersion();
        const client_version = getclient_version.data.data.version;

        const getclient_platform = await getClientPlatform.ClientPlatform();
        const client_platform = getclient_platform.data.data.platform;

        const url = `https://pd.na.a.pvp.net/mmr/v1/players/${puuid}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Riot-Entitlements-JWT': entitlements,
                'X-Riot-ClientPlatform': client_platform,
                'X-Riot-ClientVersion': client_version,
                }
        };

        const response  = await axios.get(url, config).then(res => {
        return res
    }).catch(err => {
        return err.response
    });
    return response;
    }


}