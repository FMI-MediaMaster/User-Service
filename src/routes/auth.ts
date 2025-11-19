import { Router } from 'express';
import AuthController from '@controllers/auth';
import { requireAuth } from '@media-master/express-middleware';

const routes: Router = Router();
const controller = new AuthController();

routes.post('/signup', controller.signup);
routes.post('/signin', controller.signin);
routes.get('/signout', requireAuth, controller.signout);

export default routes;
