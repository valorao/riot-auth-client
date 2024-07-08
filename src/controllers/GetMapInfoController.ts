import { Request, Response } from 'express';
import GetMapInfo from '../services/GetMapInfo';
const getMapInfo = new GetMapInfo();

export const MapInfo = async (req: Request, res: Response) => {
    if (!req.query.mapUrl || !req.query.mapName) {
        return res.status(400).json({
            status: 400,
            error: "Bad Request",
            message: "missing query parameters"
        });
    }
    const response = await getMapInfo.handle(
        (req.query.mapUrl as string), (req.query.mapName as string)
    );
    return res.status(200).json(response)
}
