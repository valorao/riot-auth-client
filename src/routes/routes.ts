import express, { Request, Response } from 'express';
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
import { MatchHistory } from '../controllers/GetMatchHistoryController';
import { MatchData } from '../controllers/GetMatchDataController';
import { MapInfo } from '../controllers/GetMapInfoController';
import { AgentInfo } from '../controllers/GetAgentInfoController';
import { LastMatches } from '../controllers/GetLastMatchesController';
import PublicRedirect from '../controllers/PublicRedirect';
import { Storefront } from '../controllers/GetStorefrontController';
import { FrontCheckApiController } from '../controllers/FrontCheckApiController';
import { NightMarket } from '../controllers/GetNightMarketController';
import { simpleTokenDecoder } from '../middlewares/simpleTokenDecoder';
import { PlayerInfo } from '../controllers/PlayerInfoController';

export const routes = express.Router();
const frontCheckApiController = new FrontCheckApiController();
const app = express();
app.use(cookieParser());

routes.get('/api/status', frontCheckApiController.handle);

routes.get('/dev/test', PublicRedirect.index);

routes.post('/auth', AuthenticateUser);

routes.delete('/fromstatic/logout', BrowserLogout);

routes.get('/auth/reauth', ReauthCookie);

routes.use(simpleTokenDecoder)

routes.get('/player/history', MatchHistory)

routes.get('/player/storefront', Storefront)

routes.get('/playerinfo', PlayerInfo)

routes.get('/player/nightmarket', NightMarket)

routes.get('/player/rank', GetPlayerRank);

routes.get('/fromstatic/cookies', GetBrowserCookies);

routes.get('/client/platform', ClientPlatform);

routes.get('/client/version', ClientVersion);

routes.get('/test/cookies', TestCookies);

routes.get('/player/pregame/leave', LeavePregameWithCookies);

routes.post('/player/history/matches/map', MapInfo)

routes.post('/player/history/matches/:matchId', MatchData)

routes.post('/data/agents/:agentId', AgentInfo)

routes.get('/player/last-matches', LastMatches)
// routes.post('/oauth', AuthenticateUserJWT)
routes.post('/player/party', PlayerParty);

routes.post('/player/pregame', PlayerPreGameId);

routes.post('/player/pregame/leave', PlayerDodge);

