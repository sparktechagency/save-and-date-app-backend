import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();

router.get("/terms-and-conditions", (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(process.cwd() + "/view/terms.html");
});

router.get("/privacy-policy", (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(process.cwd() + "/view/privacy.html");
});

router.get("/account-delete-policy", (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(process.cwd() + "/view/accountDelete.html");
});

router.get("/supports", (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(process.cwd() + "/view/support.html");
});

export const SettingsRoutes = router;