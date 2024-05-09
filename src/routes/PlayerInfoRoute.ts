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

export const player_router = express.Router();
const app = express();

app.use(cookieParser());

player_router.get('/actions/player/rank', GetPlayerRank)

player_router.get('/fromstatic/cookies', GetBrowserCookies)

player_router.delete('/fromstatic/logout', BrowserLogout)

player_router.get('/actions/player/pregame/leave', LeavePregameWithCookies)

player_router.post('/auth',AuthenticateUser)

player_router.get('/auth/reauth', ReauthCookie)

player_router.post('/player/party', PlayerParty);

player_router.post('/player/pregame', PlayerPreGameId);

player_router.post('/player/pregame/leave', PlayerDodge);
