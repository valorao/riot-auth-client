import express, { Request, Response } from 'express';
import { GetCookies } from '../middlewares/getCookies';
import { AuthAccount } from '../middlewares/authAccount';

const router = express.Router();
const getCookies = new GetCookies();
const authAccount = new AuthAccount();

router.get('/get-cookies', async (req: Request, res: Response) => {
    try {
        const response = await getCookies.postAuthCookies('85.0.1.1382.3124');
        res.status(response.status).json([response.status, response.data, response.headers])
        console.log(response.headers['set-cookie']?.find(cookie => /^asid/.test(cookie)));
    } catch (error) {
        res.status(500)
    }
});

// router.get('/auth-cookies', async (req: Request, res: Response) => {
//     try {
//         const response = await authAccount.AuthCookies('85.0.1.1382.3124', ['tdid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OWVkZmIzLWZlMzQtNDg5OC1hMWFiLWNjYzJjNDdlYmMzMSIsIm5vbmNlIjoiSy9BWi80VkZGTTA9IiwiaWF0IjoxNzE0OTM1OTQ3fQ.hhrz94XNmw7TVXrfKEqwggY_PZZXBri_-WgpeUqdihg; Max-Age=31536000; Domain=riotgames.com; Path=/; Expires=Mon, 05 May 2025 19:05:47 GMT; HttpOnly; Secure,asid=A3szQ7FJYVUYgZP7zMExCj4BlIrgz71qg9wgnYZpS3U.GfrGFo%2FotQg%3D; Path=/; HttpOnly; Secure; SameSite=Strict,clid=uw1; Path=/; HttpOnly; Secure,__cf_bm=ypTlXvq9LoSzuDR075knXKInWrfEoWx571rzvqltKnk-1714935947-1.0.1.1-KXyiaAGL7Ha6DM.gnZ9PciLhi4uQmdhcXTIhkC8qj6Zd_ko7bPEorodJ8jJuG1Os8W8f74CuEh6rqL3Lza_RMA; path=/; expires=Sun, 05-May-24 19:35:47 GMT; domain=.riotgames.com; HttpOnly; Secure; SameSite=None"']);
//         res.status(response.status).json([response.status, response.data,`set-cookie: ${response.headers['set-cookie']}`]);
//     } catch (error) {
//         res.status(500)
//     }
// });

export { router };