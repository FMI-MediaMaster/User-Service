import { Request, Response } from 'express';
import UserService from '@services/user';
import { BaseController } from '@media-master/express-crud-router';

export default class UserController extends BaseController {
    private userService = new UserService();

    readAll = async (req: Request, res: Response): Promise<void> => {
        res.ok(await this.userService.readAll());
    };

    read = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.readById(req.params.id);
        user
            ? res.ok(user)
            : res.notFound('User not found');
    };

    // TODO: update express-crud-router
    create(req: Request, res: Response): Promise<void> | void {
        res.badRequest('Method not implemented. Please use signup');
    }

    update = async (req: Request, res: Response): Promise<void> => {
        if (req.userId !== req.params.id)
            res.unauthorized('You can\'t update another user');

        const updated = await this.userService.update(req.params.id, req.body);
        updated
            ? res.ok(updated)
            : res.notFound('User not found');
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        if (req.userId !== req.params.id)
            res.unauthorized('You can\'t delete another user');

        await this.userService.delete(req.params.id)
            ? res.noContent()
            : res.notFound('User not found');
    };
}
