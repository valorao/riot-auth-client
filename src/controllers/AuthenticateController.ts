import { Request, Response } from 'express';
import { AuthenticatePlayerService } from '../services/AuthenticatePlayerService';
import { AuthenticatePlayerServiceJWT } from '../services/AuthenticatePlayerServiceJWT';
const authenticatePlayerService = new AuthenticatePlayerService();
const authenticatePlayerServiceJWT = new AuthenticatePlayerServiceJWT();

export const AuthenticateUser = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "Username and password are required. - MISSING_REQUIRED_FIELDS"
        });
    }
    if (req.query.jwt === 'true') {
        try {
            const response = await authenticatePlayerServiceJWT.handle(req.body.username, req.body.password);
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 7)
            if (response.status == 200 && req.body.remember == false || req.body.remember == undefined || req.body.remember == 'false') {
                res.cookie('ssid', response.ssid, { httpOnly: true, path: '/' })
            }
            if (response.status === 200 && req.body.remember === true || req.body.remember === 'true') {
                res.cookie('ssid', response.ssid, { httpOnly: true, path: '/', expires: expiry })
            }
            res.status(response.status).json(response);
            return res.send

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                "status": 500,
                "error": "Internal Server Error.",
                "message": "Internal Server Error. - SERVER_UNEXPECTED_ERROR"
            });
        }
    } else {
        try {
            const response = await authenticatePlayerService.handle(
                req.body.username, req.body.password
            )
            if (response.status !== 200) {
                return res.status(response.status).json({
                    status: response.status,
                    message: response.message,
                })
            }
            if (response.status === 200 && req.body.remember === true || req.body.remember === 'true') {
                res.cookie(response.tokenCookie[0].name, response.tokenCookie[0].value, response.tokenCookie[0].options);

                res.cookie(response.entitlementsCookie[0].name, response.entitlementsCookie[0].value, response.entitlementsCookie[0].options);

                res.cookie(response.puuidCookie[0].name, response.puuidCookie[0].value, response.puuidCookie[0].options);

                res.cookie(response.ssidCookie[0].name, response.ssidCookie[0].value, response.ssidCookie[0].options);
            }
            else if (response.status === 200 && req.body.remember === false || req.body.remember === undefined || req.body.remember === 'false') {
                res.cookie(response.token_onetimeCookie[0].name, response.token_onetimeCookie[0].value, response.token_onetimeCookie[0].options);

                res.cookie(response.entitlements_onetimeCookie[0].name, response.entitlements_onetimeCookie[0].value, response.entitlements_onetimeCookie[0].options);

                res.cookie(response.puuid_onetimeCookie[0].name, response.puuid_onetimeCookie[0].value, response.puuid_onetimeCookie[0].options);

                res.cookie(response.ssid_onetimeCookie[0].name, response.ssid_onetimeCookie[0].value, response.ssid_onetimeCookie[0].options);
            }
            else {
                console.error('Unexpected status or remember value:', response.status, req.body.remember);
            }
            delete response.tokenCookie;
            delete response.entitlementsCookie;
            delete response.puuidCookie;
            delete response.ssidCookie;
            delete response.token_onetimeCookie;
            delete response.entitlements_onetimeCookie;
            delete response.puuid_onetimeCookie;
            delete response.ssid_onetimeCookie;

            res.status(response.status).json(response);
        }
        catch (error) {
            console.log(error)
            res.status(500).json({
                "status": 500,
                "error": "Internal Server Error.",
                "message": "Internal Server Error. - SERVER_UNEXPECTED_ERROR"
            });
        }
    }
}
