import { Router } from 'express';
import UserController from '@controllers/user';

const routes: Router = Router();
const controller = new UserController();

routes.get('/', controller.readAll);
routes.get('/:id', controller.read);
routes.put('/:id', controller.update);
routes.delete('/:id', controller.delete);

export default routes;
