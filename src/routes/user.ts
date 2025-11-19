import { Router } from 'express';
import UserController from '@controllers/user';
import { requireAuth } from '@media-master/express-middleware';

const routes: Router = Router();
const controller = new UserController();

routes.get('/', requireAuth, controller.read);
routes.put('/', requireAuth, controller.update);
routes.delete('/', requireAuth, controller.delete);

export default routes;
