import axios from 'axios';
import GetClientPlatform from './GetClientPlatformService';
import GetClientVersion from './GetClientVersionService';
import GetWeaponStorefrontInfo from './GetWeaponStorefrontInfo';
import { GetItemsFromItemTypeId } from './GetItemsFromItemType';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();
const getWeaponStorefrontInfo = new GetWeaponStorefrontInfo();

// async function processBundles(response: any) {
//     const results = [];
//     for (const bundle of response) {
//         for (const item of bundle.Items) {
//             const itemId = item.Item.ItemID;
//             const itemTypeId = item.Item.ItemTypeID;
//             try {
//                 const itemData = await GetItemsFromItemTypeId(itemTypeId, itemId);
//                 results.push(itemData);
//             } catch (error) {
//                 results.push(null);
//             }
//         }
//     }
//     return results;
// }

export default class GetStorefrontService {
    handle = async (token: string, entitlements: string, puuid: string) => {
        try {
            const version_response = await getClientVersion.ClientVersion();
            const platform_response = await getClientPlatform.ClientPlatform();
            const version = version_response.data.data.riotClientVersion;
            const platform = platform_response.data.data.platform;

            const url = `https://pd.na.a.pvp.net/store/v2/storefront/${puuid}`;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Riot-Entitlements-JWT': entitlements,
                    'X-Riot-ClientPlatform': platform,
                    'X-Riot-ClientVersion': version,
                }
            };

            const response = await axios.get(url, config).catch(err => { return err.response; });
            const response_data: StorefrontResponse = response.data;
            if (response.status !== 200) {
                return {
                    status: response.status,
                    message: response.data,
                };
            }
            const storeOffers = response_data.SkinsPanelLayout.SingleItemStoreOffers;
            const BundleOffers = response_data.FeaturedBundle;
            const remainingDurationInS = response_data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const expirationUnixTime = currentTimeInSeconds + remainingDurationInS;

            const items = await Promise.all(storeOffers.map(async (offer: any) => {
                const offerID = offer.OfferID;
                const cost = offer.Cost[0];
                const uuid = offer.OfferID;
                const weaponInfo = await getWeaponStorefrontInfo.handle(uuid);

                return {
                    offerID,
                    cost,
                    weaponInfo,
                };
            }));

            // const offers = await processBundles(BundleOffers.Bundles);

            return {
                status: 200,
                items,
                // bundleOffers: offers,
                bundleRawOffers: BundleOffers.Bundles,
                remainingDurationInSBundle: BundleOffers.BundleRemainingDurationInSeconds,
                remainingDurationInS,
                remainingDurationInUNIX: expirationUnixTime,
            };
        } catch (error) {
            console.log(error);
            return { status: 500, message: 'Internal Server Error' };
        }
    };
}
