import express, { Request, Response, response } from 'express';
import { AuthAccount } from '../middlewares/authAccount';
import { GetEntitlements } from '../middlewares/getEntitlements';
import { GetPlayerInfo } from '../middlewares/PlayerInfo';
import { GetClientVersion } from '../middlewares/GetClientVersionService';
import { CreateCookie } from '../services/CreateCookie';

export const PlayerAuth_router = express.Router();
const authAccount = new AuthAccount();
const getEntitlements = new GetEntitlements();
const getPlayerInfo = new GetPlayerInfo();
const getClientVersion = new GetClientVersion();
const createCookie = new CreateCookie();


PlayerAuth_router.post('/auth', async (req: Request, res: Response) => {
    try {
        const cookiesValue = await createCookie.handle();
        const version = await getClientVersion.ClientVersion();
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
            })
    } catch (error) {
        if(!req.body.username || !req.body.password) {
            return res.status(400).json({
                "status": 400,
                "message": "Missing username or password"
            });
        }if(req.body.username && req.body.password) {
            return res.status(401).json({
                "status": 401,
                "message": "Wrong username or password"
            });
        }
         else {
            return res.status(500).json({
                "status": 500,
                "message": "Internal Server Error"
            });
        }
    }

});
