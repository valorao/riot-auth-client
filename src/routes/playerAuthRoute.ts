import express, { Request, Response, response } from 'express';
import { GetCookies } from '../middlewares/getCookies';
import { AuthAccount } from '../middlewares/authAccount';
import { GetEntitlements } from '../middlewares/getEntitlements';
import { GetPlayerInfo } from '../middlewares/PlayerInfo';
import { GetClientVersion } from '../middlewares/GetClientVersionService';
import { GetClientPlatform } from '../middlewares/GetClientPlatformService';

const router = express.Router();
const getCookies = new GetCookies();
const authAccount = new AuthAccount();
const getEntitlements = new GetEntitlements();
const getPlayerInfo = new GetPlayerInfo();
const getClientVersion = new GetClientVersion();
const getClientPlatform = new GetClientPlatform();


const cookies = getCookies.postAuthCookies('85.0.1.1382.3124').then(res => {
    res.headers['set-cookie']?.find(cookie => /^asid/.test(cookie));
    
    return res.headers['set-cookie']?.find(cookie => /^asid/.test(cookie));
})

router.get('/client/platform', async (req: Request, res: Response) => {
    const response = await getClientPlatform.ClientPlatform();
    res.json({ 
        "status": res.status,
        "platform": response.data.data.platform
    });
});

router.get('/client/version', async (req: Request, res: Response) => {
    const version = true
    const response = await getClientVersion.ClientVersion(version || '');
    res.json({
        "status": res.status,
        "version": response.data.data.riotClientVersion
    });
});

router.post('/auth', async (req: Request, res: Response) => {
    const cookiesValue = await cookies;
    const version = await getClientVersion.ClientVersion(true);
    const clientversion = version.data.data.version;
    const response = await authAccount.AuthCookies(
        clientversion , req.body.username, req.body.password, cookiesValue || '');
    const uri = response.data.response.parameters.uri;
    const url = new URL(uri);
    const params = new URLSearchParams(url.search);
    const token = params.get('access_token');
    const expires = params.get('expires_in');
    const id_token = params.get('id_token');

    const ent = await getEntitlements.Entitlements(token || '');
    const entitlements_token = ent.data.entitlements_token;

    const info = await getPlayerInfo.PlayerInfo(token || '');
    const puuid = info.data.sub;
    const riotid = info.data.acct.game_name + '#' + info.data.acct.tag_line;

    res.header('Cookie', cookiesValue).header('X-Powered-By', 'valorao/1.0.0-beta').status(response.status)
    .json({
        "status": response.status,
        "riotid": riotid,
        "puuid": puuid,
        "Bearer": token,
        "id_token": id_token,
        "Expires in": expires,
        "entitlements": entitlements_token
        });
});

export { router };
