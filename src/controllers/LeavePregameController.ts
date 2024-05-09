import { Request, Response } from 'express';
import { DodgeQueueServiceWithCookies } from '../services/DodgeQueueServiceWithCookies';

const dodgeQueueServiceWithCookies = new DodgeQueueServiceWithCookies();

export const LeavePregameWithCookies = async (req: Request, res: Response) => {
    const response = await dodgeQueueServiceWithCookies.handle(
        req.headers.cookie || ''
    )
    const responseObject = {
        status: response.status,
    }
    res.status(response.status).json(responseObject)
}