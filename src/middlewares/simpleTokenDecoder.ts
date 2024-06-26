import { Request, Response, NextFunction } from "express";
import { jwtDecrypt } from "jose";

export async function simpleTokenDecoder(req: Request, res: Response, next: NextFunction) {
    if (req.cookies.token || req.cookies.entitlements || req.cookies.puuid) {
        return next();
    }
    if (!req.headers.authorization) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request - No Authorization Token/No cookies found",
            "message": "missing body parameters"
        });
    }
    if (req.headers.authorization.split(' ')[0] === 'Bearer') {
        try {
            const secretHex = process.env.SECRET;
            const secret = Buffer.from((secretHex as string), 'hex');
            const parts = req.headers.authorization.split(' ')[1].split('.');
            const headerBase64 = parts[0];
            const headerJson = atob(headerBase64);
            const header = JSON.parse(headerJson);
            if (header.exp <= Math.floor(Date.now() / 1000)) {
                return res.status(401).json({ status: 401, error: 'Token expired', message: "This token is expired." })
            }
            const { payload } = await jwtDecrypt(req.headers.authorization.split(' ')[1].toString(), (secret as any));
            req.cookies = {
                ...req.cookies,
                ...payload
            }
            next();
        } catch (err) {
            return res.status(500).json({ status: 500, error: err, message: "There was an error while decoding your token." })
        }
    } else {
        return res.status(422).json({
            status: 422,
            error: "Unprocessable Entity - No bearer token provided",
            message: "An non Bearer token was provided to a Bearer token endpoint."
        })
    }
}