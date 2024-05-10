import { Request, Response } from "express";

export default class PublicRedirect {
    public static index(req: Request, res: Response): void {
        const languages = req.acceptsLanguages();
        console.log(languages);
        if (languages.includes('pt') || languages.includes('pt-BR')) {
            res.redirect("/account/pt-BR/");
        }
        if (languages.includes('en') || languages.includes('en-US')) {
            res.redirect("/account/en-US/");
        }
    }
}