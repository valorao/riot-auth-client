import { Request, Response } from 'express';
import { AuthenticatePlayerService } from '../services/AuthenticatePlayerService';
const authenticatePlayerService = new AuthenticatePlayerService();

export const AuthenticateUser = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "Username and password are required"
        });
    }
    try {
        const response = await authenticatePlayerService.handle(
            req.body.username, req.body.password
        )
        if(response.status === 200 && req.body.remember === 'true') {
            const puuidCookie = response.cookie[0];
            res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);
    
            const ssidCookie = response.ssid[0];
            res.cookie(ssidCookie.name, ssidCookie.value, ssidCookie.options);
    
            const token = response.bearertoken[0];
            res.cookie(token.name, token.value, token.options);
    
            const entitlements = response.entitlements[0];
            res.cookie(entitlements.name, entitlements.value, entitlements.options);
        }
        if (response.status === 200 && req.body.remember === 'false' || req.body.remember === undefined) {
            const puuidCookie = response.puuid_onetime[0];
            res.cookie(puuidCookie.name, puuidCookie.value, puuidCookie.options);
    
            const ssidCookie = response.ssid_onetime[0];
            res.cookie(ssidCookie.name, ssidCookie.value, ssidCookie.options);
    
            const token = response.bearertoken_onetime[0];
            res.cookie(token.name, token.value, token.options);
    
            const entitlements = response.entitlements_onetime[0];
            res.cookie(entitlements.name, entitlements.value, entitlements.options);
            
        }
        delete response.cookie
        delete response.bearertoken
        delete response.bearertoken_onetime
        delete response.entitlements,
        delete response.entitlements_onetime
        delete response.puuid
        delete response.puuid_onetime
        delete response.ssid
        delete response.ssid_onetime;
    
        res.status(response.status).json(response);
    }
    catch (error) {
        res.status(400).json({
            "status": 500,
            "error": "Internal Server Error",
        });
    }
}