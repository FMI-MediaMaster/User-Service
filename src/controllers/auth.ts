import { Request, Response } from 'express';
import AuthService from '@services/auth';
import { validateFromBody } from '@utils/validation';

export default class AuthController {
    private authService = new AuthService();

    signin = async (req: Request, res: Response): Promise<void> => {
        validateFromBody(req.body as Record<string, unknown>, ['email', 'password']);
        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        res.ok(await this.authService.signin(email, password));
    };

    signup = async (req: Request, res: Response): Promise<void> => {
        validateFromBody(req.body as Record<string, unknown>, [
            'email',
            'password',
            'name',
        ]);

        const { email, password, name, photoUrl } = req.body as {
            email: string;
            password: string;
            name: string;
            photoUrl?: string;
        };

        res.created(await this.authService.signup({
            email,
            password,
            name,
            photoUrl,
        }));
    };

    signout = async (req: Request, res: Response): Promise<void> => {
        console.log(req.userId);
        await this.authService.signout(req.userId as string);
        res.noContent();
    };

    details = async (req: Request, res: Response): Promise<void> => {
        res.ok(await this.authService.getDetails(req.userId as string));
    };
}
