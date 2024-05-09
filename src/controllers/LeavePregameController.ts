import { Request, Response } from 'express';
import { DodgeQueueService } from '../services/DodgeQueueService';
import { DodgeQueueServiceWithCookies } from '../services/DodgeQueueServiceWithCookies';

const dodgeQueueService = new DodgeQueueService();
const dodgeQueueServiceWithCookies = new DodgeQueueServiceWithCookies();

export const LeavePregameWithLogin = async (req: Request, res: Response) => {
    const response = await dodgeQueueService.handle(
        req.body.username, req.body.password
    )
    res.status(response.status).json(response.data)
}

export const LeavePregameWithCookies = async (req: Request, res: Response) => {
    const response = await dodgeQueueServiceWithCookies.handle(
        req.headers.cookie || ''
    )
    const responseObject = {
        status: response.status,
    }
    res.status(response.status).json(responseObject)
}