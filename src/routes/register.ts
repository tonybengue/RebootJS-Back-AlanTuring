import { Request, Response, NextFunction, Router } from 'express';
import { User } from '../models/users';

export const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { password, ...info } = req.body;
    const user = new User({ ...info });
    user.setPassword(password);
    user.save(() => {
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    });
  } catch (error) {
    next(error);
  }
});

export default router;