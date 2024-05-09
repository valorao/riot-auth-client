import { GetCookies } from '../middlewares/getCookies';

const getCookies = new GetCookies();

export class CreateCookie {
    handle = async () => {
        try {
            const cookies = getCookies.postAuthCookies().then(res => {
                res.headers['set-cookie']?.find((cookie: string) => /^asid/.test(cookie));
                
                return res.headers['set-cookie']?.find((cookie: string) => /^asid/.test(cookie));
            })
            return cookies;
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
