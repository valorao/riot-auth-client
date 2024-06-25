import { Request, Response } from 'express';
import GetPlayerWallet from '../services/GetPlayerWalletService';
import GetPlayerRankandInfo from '../services/PlayerRank';
const getPlayerWallet = new GetPlayerWallet();
const getPlayerRank = new GetPlayerRankandInfo();

export const PlayerInfo = async (req: Request, res: Response) => {
    if (!req.cookies.token || !req.cookies.entitlements || !req.cookies.puuid) {
        return res.status(400).json({ message: 'Missing cookies' })
    }
    const response = await getPlayerWallet.handle(req.cookies.token, req.cookies.entitlements, req.cookies.puuid);
    const playerRank = await getPlayerRank.handle(req.cookies.token, req.cookies.entitlements, req.cookies.puuid);
    console.log(playerRank)
    return res.status(200).json({ ...response, ...playerRank });
}