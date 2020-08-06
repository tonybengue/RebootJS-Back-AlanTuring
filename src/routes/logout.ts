import { Request, Response, Router } from 'express';
import { authenticationRequired } from '../middlewares/authenticationRequired';

const router = Router();

router.post('/', authenticationRequired, (req: Request, res: Response) => {
  req.logout();
  res.send();
});

export default router;