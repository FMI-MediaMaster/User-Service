import { Request, Response } from 'express';
import UserService from '@services/user';

export default class UserController {
    private userService = new UserService();

    read = async (req: Request, res: Response): Promise<void> => {
        res.ok(await this.userService.read());
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const updated = await this.userService.update(req.userId as string, req.body);
        updated
            ? res.ok(updated)
            : res.notFound('User not found');
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        await this.userService.delete(req.userId as string)
            ? res.noContent()
            : res.notFound('User not found');
    };
};
