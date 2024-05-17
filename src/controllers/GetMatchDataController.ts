import { Request, Response } from 'express';
import GetMatchData from '../services/GetMatchData';
const getMatchData = new GetMatchData();

export const MatchData = async (req: Request, res: Response) => {
    if(!req.cookies.token || !req.cookies.entitlements || !req.cookies.puuid || !req.params.matchId) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "missing body parameters"
        });
    }
    if (!req.params.matchId || req.params.matchId === undefined) {
        return {
            status: 400,
            message: "Missing matchID in body parameters",
        }
    }
    const response = await getMatchData.handle(
        req.cookies.token, req.cookies.entitlements, req.params.matchId
    );
    if(response.status === 400) {
        return res.status(401).json({
            "status": 401,
            "message": "Please relogin or reauth cookies.",
            "error": response.message
        })
    }
    res.status(response.status).json(response)
}
