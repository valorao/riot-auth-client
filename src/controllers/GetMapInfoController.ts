import { Request, Response } from 'express';
import GetMapInfo from '../services/GetMapInfo';
const getMapInfo = new GetMapInfo();

export const MapInfo = async (req: Request, res: Response) => {
    if(!req.body.mapUrl) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "missing header parameters"
        });
    }
    const response = await getMapInfo.handle(
        (req.body.mapUrl as string)
    );
    if(response.status === 400) {
        return res.status(401).json({
            "status": 401,
            "message": "Please relogin or reauth cookies."
        })
    }
    res.status(200).json(response)
}
