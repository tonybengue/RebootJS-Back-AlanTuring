import { Router } from 'express';
import usersRoutes from './usersRoute';
import loginRoutes from './loginRoutes';
import messageRoutes from "./messagesRoutes";

// Init the router which is global
const router = Router();

router.use('/users', usersRoutes)
router.use('/login', loginRoutes)
router.use('/messages', messageRoutes);

export default router