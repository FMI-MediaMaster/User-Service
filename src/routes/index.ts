import { Router } from 'express';
import usersRouter from './users'
import authRouter from './auth'

const routes: Router = Router();

routes.use('/users', usersRouter);
routes.use('/auth', authRouter);

export default routes;
