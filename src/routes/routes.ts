import express, { Request, Response } from 'express';
import { GetCookies } from '../middlewares/getCookies';
import { AuthAccount } from '../middlewares/authAccount';

const router = express.Router();
const getCookies = new GetCookies();
const authAccount = new AuthAccount();

router.get('/get-cookies', async (req: Request, res: Response) => {
    try {
        const response = await getCookies.postAuthCookies('85.0.1.1382.3124');
        // res.status(response.status).json([response.status, response.data, response.headers])
        res.json(response.headers['set-cookie']?.find(cookie => /^asid/.test(cookie)));
    } catch (error) {
        res.status(500)
    }
});


router.put('/auth-cookies', async (req: Request, res: Response) => {
        const response = await authAccount.AuthCookies('85.0.1.1382.3124', req.body.username, req.body.password, req.body.asid);
        res.status(response.status).json(response.data);
});

export { router };