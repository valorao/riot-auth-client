import express, { Request, Response } from 'express';
import { GetClientPlatform } from '../middlewares/GetClientPlatformService';
import { GetClientVersion } from '../middlewares/GetClientVersionService';
import { CreateCookie } from '../services/CreateCookie';

export const ClientInfo_Router = express.Router();
const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();
const createCookie = new CreateCookie();

ClientInfo_Router.get('/client/platform', async (req: Request, res: Response) => {
    const response = await getClientPlatform.ClientPlatform();
    res.json({ 
        "status": res.status,
        "platform": response.data.data.platform
    });
});

ClientInfo_Router.get('/client/version', async (req: Request, res: Response) => {
    const response = await getClientVersion.ClientVersion();
    res.json({
        "status": res.status,
        "version": response.data.data.riotClientVersion,
        "build": response.data.data.riotClientBuild
    });
});

ClientInfo_Router.get('/test/cookies', async (req: Request, res: Response) => {
    const cookie = await createCookie.handle();
    console.log(cookie)
    res.json({});
});