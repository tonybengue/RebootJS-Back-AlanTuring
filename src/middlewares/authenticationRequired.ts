import { Request, Response, NextFunction } from "express";

// Verify the authentification of the user
export function authenticationRequired(req: Request, res: Response, next: NextFunction) {
    if(req.isAuthenticated()) return next();
    res.status(401).send();
}