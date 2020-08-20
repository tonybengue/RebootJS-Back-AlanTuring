import { Request, Response, NextFunction, Router } from 'express';
import passport from 'passport';
import { User } from '../models/users';

export const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('local', function (err, userId) {
    if (err) return next(err);
    if (!userId) return res.status(401).send();
    req.logIn(userId, async (err) => {
      if (err) return next(err);
      const user = await User.findById(userId);
      if (!user) throw Error('User not found');
      res.json(user.getSafeProfile());
    });
  })(req, res, next);
});

export default router;