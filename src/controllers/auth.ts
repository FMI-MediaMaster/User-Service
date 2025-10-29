import { Request, Response } from 'express';
import AuthService from '@services/auth';

export default class AuthController {
    private service = new AuthService();

    // TODO
    login = async (req: Request, res: Response): Promise<void> => {
        console.log("login");
        res.noContent();
    };

    // TODO: async + promise
    signup = (req: Request, res: Response): void => {
        console.log("signup");
        res.noContent();
    };

    // TODO: async + promise
    logout = (req: Request, res: Response): void => {
        console.log("logout");
        res.noContent();
    };
}
