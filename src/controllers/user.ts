import { Request, Response } from 'express';
import UserService from '@services/user';
import { ValidationError } from '@utils/validation';

export default class UserController {
    private userService = new UserService();

    readAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.readAll();
            res.status(200).json(users);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Unexpected error during readAll';
            res.status(400).json({ error: message });
        }
    };

    read = async (req: Request, res: Response): Promise<void> => {
        try {
            const id: string = req.params.id;
            const user = await this.userService.readById(id);

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json(user);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Unexpected error during read';
            res.status(400).json({ error: message });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id: string = req.params.id;
            const updated = await this.userService.update(id, req.body);

            if (!updated) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json(updated);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                res.status(err.status).json({ error: err.message });
                return;
            }
            const message =
                err instanceof Error ? err.message : 'Unexpected error during update';
            res.status(400).json({ error: message });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id: string = req.params.id;
            const success = await this.userService.delete(id);

            if (!success) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(204).send();
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Unexpected error during delete';
            res.status(400).json({ error: message });
        }
    };
}
