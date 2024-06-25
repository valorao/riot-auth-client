import axios from 'axios';
import GetClientVersion from "./GetClientVersionService";
import GetClientPlatform from "./GetClientPlatformService";

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();

type WalletResponse = {
    [currency: string]: number;
}

export default class GetPlayerWallet {
    handle = async (token: string, entitlements: string, puuid: string) => {
        if (!token || !entitlements || !puuid) return { status: 400, message: 'Missing parameters' };
        try {
            const version_response = await getClientVersion.ClientVersion();
            const platform_response = await getClientPlatform.ClientPlatform();
            const version = version_response.data.data.riotClientVersion;
            const platform = platform_response.data.data.platform;

            const walletResponse = await axios.get(`https://pd.na.a.pvp.net/store/v1/wallet/${puuid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-Riot-Entitlements-JWT': entitlements,
                    'X-Riot-ClientPlatform': platform,
                    'X-Riot-ClientVersion': version,
                }
            });

            let currencyData: WalletResponse = {};
            if (walletResponse.data.Balances) {
                const currencyPromises = Object.entries(walletResponse.data.Balances).map(async ([currencyId, amount]) => {
                    const getCurrencyName = await axios.get(`https://valorant-api.com/v1/currencies/${currencyId}?language=pt-BR`);
                    const currency = getCurrencyName.data.data.displayName;
                    currencyData[currency] = amount as number;
                });

                await Promise.all(currencyPromises);
            }

            return { Balances: currencyData };
        } catch (error) {
            console.error(error);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
}
