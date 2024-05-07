import express from 'express';
import 'dotenv/config';

export const headersMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header({
        'X-Powered-By': process.env.AGENT+'/'+process.env.VERSION,
        'X-Valorao-Pop': process.env.REGION+'-'+process.env.SUBREGION,
        'X-Valorao-Edge': process.env.EDGE,
        'server': process.env.SERVER,
    });
    next();
};