import express, { Request, Response } from 'express';
import { GetCookies } from '../middlewares/getCookies';
import { AuthAccount } from '../middlewares/authAccount';
import { GetEntitlements } from '../middlewares/getEntitlements';

const router = express.Router();
const getCookies = new GetCookies();
const authAccount = new AuthAccount();
const getEntitlements = new GetEntitlements();


const cookies = getCookies.postAuthCookies('85.0.1.1382.3124').then(res => {
    res.headers['set-cookie']?.find(cookie => /^asid/.test(cookie));
    
    return res.headers['set-cookie']?.find(cookie => /^asid/.test(cookie));
})

router.put('/auth-cookies', async (req: Request, res: Response) => {
    const cookiesValue = await cookies;

    const response = await authAccount.AuthCookies(
        '85.0.1.1382.3124', req.body.username, req.body.password, cookiesValue || ''
    );

    res.header('Cookie', cookiesValue).header('X-Powered-By', 'valorao/1.0.0-beta').status(response.status)
    .json(response.data);
});


router.post('/entitlements', async (req: Request, res: Response) => {
    
    const response = await getEntitlements.Entitlements(req.body.token);

    res.header('X-Powered-By', 'valorao/1.0.0-beta').status(response.status)
    .json(response.data);
});

export { router };

