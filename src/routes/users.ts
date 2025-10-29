import { Router } from 'express';
import userController from '@controllers/user';
import { createRouter } from '@media-master/express-crud-router';

const routes: Router = Router();

routes.use(createRouter(userController));

export default routes;
