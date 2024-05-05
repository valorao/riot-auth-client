import express, { Request, Response } from 'express';
import { GetCookies } from '../middlewares/getCookies';

const router = express.Router();
const getCookies = new GetCookies();

router.get('/get-cookies', async (req: Request, res: Response) => {
    try {
        const response = await getCookies.postAuthCookies('85.0.1.1382.3124');
        res.status(response.status).json([response.status, response.data,`set-cookie: ${response.headers['set-cookie']}`]);
    } catch (error) {
        res.status(500)
    }
});

export { router };