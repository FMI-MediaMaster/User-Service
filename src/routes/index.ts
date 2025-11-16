import { Router } from 'express';
import authRouter from './auth';
import userController from '@controllers/user';
import { createRouter } from '@media-master/express-crud-router';

const routes: Router = Router();

routes.use('/auth', authRouter);
routes.use('/users', createRouter(userController));

export default routes;
