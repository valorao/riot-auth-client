import { Request, Response } from "express";
export default class PublicRedirect {
    public static index(req: Request, res: Response): void {
        try {
            const languages = req.acceptsLanguages();
            if (languages.includes('pt') || languages.includes('pt-BR')) {
                res.redirect("/account/pt-BR/");
            } else if (languages.includes('en') || languages.includes('en-US')) {
                res.redirect("/account/en-US/");
            } else {
                res.redirect("/account/en-US/");
            }
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}
