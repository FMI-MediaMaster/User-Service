import userController from '@controllers/user';
import { Router } from 'express';
import { createRouter } from '@FMI-MediaMaster/express-crud-router';

const routes: Router = Router();

routes.use('/users', createRouter(userController));

export default routes;

