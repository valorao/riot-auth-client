import { Request, Response } from 'express';
import GetMapInfo from '../services/GetMapInfo';
const getMapInfo = new GetMapInfo();

export const MapInfo = async (req: Request, res: Response) => {
    const response = await getMapInfo.handle(
        (req.query.mapUrl as string), (req.query.mapName as string)
    );
    return res.status(response.status).json(response)
}
