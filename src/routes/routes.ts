import express from 'express';
import cookieParser from 'cookie-parser';
import { GetBrowserCookies } from '../controllers/BrowserCookiesController';
import { GetPlayerRank } from '../controllers/PlayerRankController';
import { BrowserLogout } from '../controllers/BrowserLogoutController';
import { LeavePregameWithCookies } from '../controllers/LeavePregameController';
import { AuthenticateUser } from '../controllers/AuthenticateController';
import { ReauthCookie } from '../controllers/ReauthenticateUserController';
import { PlayerParty } from '../controllers/PlayerPartyController';
import { PlayerPreGameId } from '../controllers/PlayerPreGameController';
import { PlayerDodge } from '../controllers/PlayerPreGameLeave';
import { ClientPlatform, ClientVersion, TestCookies } from '../controllers/RiotClient/VersionController';

export const routes = express.Router();
const app = express();

app.use(cookieParser());

routes.get('/actions/player/rank', GetPlayerRank)

routes.get('/fromstatic/cookies', GetBrowserCookies)

routes.delete('/fromstatic/logout', BrowserLogout)

routes.get('/actions/player/pregame/leave', LeavePregameWithCookies)

routes.post('/auth',AuthenticateUser)

routes.get('/auth/reauth', ReauthCookie)

routes.post('/player/party', PlayerParty);

routes.post('/player/pregame', PlayerPreGameId);

routes.post('/player/pregame/leave', PlayerDodge);

routes.get('/client/platform', ClientPlatform);

routes.get('/client/version', ClientVersion);

routes.get('/test/cookies', TestCookies);
