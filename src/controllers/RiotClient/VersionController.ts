import { Request, Response } from 'express';

import GetClientPlatform from '../../services/GetClientPlatformService';
import GetClientVersion from '../../services/GetClientVersionService';
import { CreateCookie } from '../../services/CreateCookie';

const getClientPlatform = new GetClientPlatform();
const getClientVersion = new GetClientVersion();
const createCookie = new CreateCookie();

export const ClientVersion = async (req: Request, res: Response) => {
    const response = await getClientVersion.ClientVersion();
    res.json({
        "status": res.status,
        "version": response.data.data.riotClientVersion,
        "build": response.data.data.riotClientBuild
    });
}

export const ClientPlatform = async (req: Request, res: Response) => {
    const response = await getClientPlatform.ClientPlatform();
    res.json({ 
        "status": res.status,
        "platform": response.data.data.platform
    });
}

export const TestCookies = async (req: Request, res: Response) => {
    const cookie = await createCookie.handle();
    res.status(200).json({cookie: cookie});
}
