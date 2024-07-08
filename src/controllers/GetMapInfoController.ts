import { Request, Response } from 'express';
import GetMapInfo from '../services/GetMapInfo';
const getMapInfo = new GetMapInfo();

export const MapInfo = async (req: Request, res: Response) => {
    if (!req.query.mapUrl) {
        const response = await getMapInfo.handle(
            undefined, (req.query.mapName as string)
        );
        return res.status(response.status).json(response)
    } else if (!req.query.mapName) {
        const response = await getMapInfo.handle(
            (req.query.mapUrl as string)
        );
        return res.status(response.status).json(response)
    } else {
        return res.status(400).json({
            status: 400,
            error: "Bad Request",
            message: "missing query parameters"
        });
    }
}
