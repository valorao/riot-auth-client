import axios from 'axios';

import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';
import GetWeaponStorefrontInfo from './GetWeaponStorefrontInfo';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();
const getWeaponStorefrontInfo = new GetWeaponStorefrontInfo();

export default class GetNightMarket {
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

            
            const response  = await axios.get(url, config).catch(err => {return err.response});
            if (response.status !== 200) {
                return {
                    status : response.status,
                    message: response.data,
                }
            }
            const offers = response.data.BonusStore.BonusStoreOffers;
            if(!offers) {
                return {
                    status: 404,
                    message: "Night Market is not available"
                }
            }

            const currencyKey = "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741";
            const formattedOffers = await Promise.all(offers.map(async (offer: any) => {
                const offerId = offer.Offer.OfferID;
                const discountPercent = offer.DiscountPercent;
                const discountPrice = offer.DiscountCosts?.[currencyKey] ?? 0;
                const weaponSkin = await getWeaponStorefrontInfo.handle(offerId);
                const price = Math.floor(discountPrice / (1 - (discountPercent / 100)));

                return {
                    offerId,
                    price,
                    discountPercent,
                    discountPrice,
                    weaponSkin,
                };
            }));

            return {
                status: 200,
                formattedOffers,
            }
        }
        catch (error) {
            console.log(error)
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
