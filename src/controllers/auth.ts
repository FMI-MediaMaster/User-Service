import { Request, Response } from 'express';
import AuthService from '@services/auth';
import { SignInSchema, SignUpSchema } from '@schemas/auth';

export default class AuthController {
    private authService = new AuthService();

    signup = async (req: Request, res: Response): Promise<void> => {
        const { email, password, name, photoUrl } = SignUpSchema.parse(req.body);;
        res.created(await this.authService.signup({
            email,
            password,
            name,
            photoUrl,
        }));
    };

    signin = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = SignInSchema.parse(req.body);
        res.ok(await this.authService.signin(email, password));
    };

    signout = async (req: Request, res: Response): Promise<void> => {
        await this.authService.signout();
        res.noContent();
    };
};
