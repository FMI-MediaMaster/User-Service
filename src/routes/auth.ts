import { Router } from 'express';
import AuthController from "@controllers/auth"

const routes: Router = Router();
const controller = new AuthController();

routes.post('/login', controller.login);
routes.post('/signup', controller.signup);
routes.get('/logout', controller.logout);

export default routes;
