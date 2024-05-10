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
import { MatchHistory } from '../controllers/GetMatchHistoryController';
import { MatchData } from '../controllers/GetMatchDataController';
import { MapInfo } from '../controllers/GetMapInfoController';
import { AgentInfo } from '../controllers/GetAgentInfoController';
import { LastMatches } from '../controllers/GetLastMatchesController';

export const routes = express.Router();
const app = express();
app.use(cookieParser());

routes.get('/dev/player/history', MatchHistory)

routes.get('/actions/player/rank', GetPlayerRank);

routes.get('/fromstatic/cookies', GetBrowserCookies);

routes.get('/client/platform', ClientPlatform);

routes.get('/client/version', ClientVersion);

routes.get('/test/cookies', TestCookies);

routes.get('/actions/player/pregame/leave', LeavePregameWithCookies);

routes.get('/auth/reauth', ReauthCookie);

routes.post('/dev/player/history/matches/map', MapInfo)

routes.post('/dev/player/history/matches/:matchId', MatchData)

routes.post('/dev/data/agents/:agentId', AgentInfo)

routes.get('/dev/player/last-matches', LastMatches)

routes.post('/auth',AuthenticateUser);

routes.post('/player/party', PlayerParty);

routes.post('/player/pregame', PlayerPreGameId);

routes.post('/player/pregame/leave', PlayerDodge);

routes.delete('/fromstatic/logout', BrowserLogout);
