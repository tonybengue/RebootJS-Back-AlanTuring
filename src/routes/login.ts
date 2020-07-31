import { Request, Response, NextFunction, Router } from 'express';
import passport from 'passport';

export const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('local', function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send();
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json(user);
    });
  })(req, res, next);
});

export default router;