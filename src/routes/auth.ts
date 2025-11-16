import { Router } from 'express';
import AuthController from '@controllers/auth';
import { requireAuth } from '@media-master/express-middleware';

const routes: Router = Router();
const controller = new AuthController();

routes.post('/signin', controller.signin);
routes.post('/signup', controller.signup);
routes.get('/signout', requireAuth, controller.signout);
routes.get('/details', requireAuth, controller.details);

export default routes;
