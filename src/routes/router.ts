import { Router } from 'express';
import usersRoutes from './usersRoute';

// Init the router which is global
const router = Router();
router.use('/users', usersRoutes)

export default router