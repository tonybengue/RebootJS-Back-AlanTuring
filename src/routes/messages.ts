import { Router, Request, Response } from 'express';
import * as messageController from '../controllers/messages';
import { authenticationRequired } from '../middlewares/authenticationRequired';

export const router = Router();

router.post('/', authenticationRequired, async (req: Request, res: Response) => {
  const { conversationId, targets, content } = req.body
  if (!conversationId || !targets || !content) res.sendStatus(400);

  res.send(await messageController.createMessage(
    req.user as any,
    conversationId,
    targets,
    content
  ));
});

router.get('/:conversationId', authenticationRequired, async (req: Request, res: Response) => {
  if(!req.params['conversationId']) res.sendStatus(400);
  const conversationId = req.params['conversationId'];
  res.send(await messageController.getAllMessages(req.user as any, conversationId));
});

router.get('/', authenticationRequired, async (req: Request, res: Response) => {
  res.send(await messageController.getAllMessages(req.user as any))
})

export default router;