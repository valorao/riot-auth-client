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

router.post('/auth', async (req: Request, res: Response) => {
    const cookiesValue = await cookies;

    const response = await authAccount.AuthCookies(
        '85.0.1.1382.3124', req.body.username, req.body.password, cookiesValue || '');

    const uri = response.data.response.parameters.uri;
    const url = new URL(uri);
    const params = new URLSearchParams(url.search);
    const token = params.get('access_token');
    const expires = params.get('expires_in');

    const ent = await getEntitlements.Entitlements(token || '');
    const entitlements_token = ent.data.entitlements_token;

    res.header('Cookie', cookiesValue).header('X-Powered-By', 'valorao/1.0.0-beta').status(response.status)
    .json({
        "Bearer": token,
        "Expires in": expires,
        "entitlements": entitlements_token
        });
});

export { router };
