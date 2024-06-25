import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';
import GetWeaponStorefrontInfo from './GetWeaponStorefrontInfo';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();
const getWeaponStorefrontInfo = new GetWeaponStorefrontInfo();

export default class GetStorefrontService {
    handle = async (token: string, entitlements: string, puuid: string) => {
        try {
            const version_response = await getClientVersion.ClientVersion();
            const platform_response = await getClientPlatform.ClientPlatform();
            const version = version_response.data.data.riotClientVersion;
            const platform = platform_response.data.data.platform;

            const url = `https://pd.na.a.pvp.net/store/v2/storefront/${puuid}`
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Riot-Entitlements-JWT': entitlements,
                    'X-Riot-ClientPlatform': platform,
                    'X-Riot-ClientVersion': version,
                }
            };

            const response = await axios.get(url, config).catch(err => { return err.response });
            if (response.status !== 200) {
                return {
                    status: response.status,
                    message: response.data,
                }
            }

            const storeOffers = response.data.SkinsPanelLayout.SingleItemStoreOffers;
            const remainingDurationInS = response.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Convert current time from milliseconds to seconds
            const expirationUnixTime = currentTimeInSeconds + remainingDurationInS;


            const items = await Promise.all(storeOffers.map(async (offer: any, index: number) => {
                const offerID = offer.OfferID;
                const cost = Object.values(offer.Cost)[0];
                const uuid = offer.OfferID;
                const weaponInfo = await getWeaponStorefrontInfo.handle(uuid);

                return {
                    offerID,
                    cost,
                    weaponInfo,
                };
            }));

            return {
                status: 200,
                items,
                remainingDurationInS,
                remainingDurationInUNIX: expirationUnixTime,
            };
        }
        catch (error) {
            console.log(error)
            return { status: 500, message: 'Internal Server Error', };
        }
    }
}
