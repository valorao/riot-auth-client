import { Request, Response } from "express";

export class FrontCheckApiController {
    handle = async(req: Request, res: Response) => {
        setTimeout(() => {
            res.status(200).json({
                "status": 200,
                "message": "API is healthy."
            });
        }, 10);
    }
}