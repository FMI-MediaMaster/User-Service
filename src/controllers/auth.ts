import { Request, Response } from 'express';
import AuthService from '@services/auth';
import { verifyJwt } from '@utils/jwt';
import { ValidationError, validateFromBody } from '@utils/validation';
import { extractBearerToken } from '@helpers/auth';

export default class AuthController {
    private authService = new AuthService();

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            validateFromBody(req.body as Record<string, unknown>, ['email', 'password']);

            const { email, password } = req.body as {
                email: string;
                password: string;
            };

            const authResponse = await this.authService.login(email, password);
            res.status(200).json(authResponse);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                res.status(err.status).json({ error: err.message });
                return;
            }
            const message =
                err instanceof Error ? err.message : 'Unexpected error during login';
            res.status(401).json({ error: message });
        }
    };

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            validateFromBody(req.body as Record<string, unknown>, [
                'email',
                'password',
                'name',
                'isGuest',
            ]);

            const { email, password, name, isGuest, photoUrl } = req.body as {
                email: string;
                password: string;
                name: string;
                isGuest: boolean;
                photoUrl?: string;
            };

            const createdUser = await this.authService.signup({
                email,
                password,
                name,
                isGuest,
                photoUrl,
            });

            res.status(201).json(createdUser);
        } catch (err: unknown) {
            if (err instanceof ValidationError) {
                res.status(err.status).json({ error: err.message });
                return;
            }
            const message =
                err instanceof Error ? err.message : 'Unexpected error during signup';
            res.status(400).json({ error: message });
        }
    };

    details = async (req: Request, res: Response): Promise<void> => {
        try {
            const accessToken = extractBearerToken(req);
            const tokenPayload = verifyJwt(accessToken);
            const userId = tokenPayload.userId;

            const userDetails = await this.authService.getDetails(userId);
            if (!userDetails) {
                res.status(404).json({ error: 'user not found' });
                return;
            }

            res.status(200).json(userDetails);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Unexpected error during details';
            res.status(401).json({ error: message });
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            const accessToken = extractBearerToken(req);
            const tokenPayload = verifyJwt(accessToken);
            const userId = tokenPayload.userId;

            await this.authService.logout(userId);
            res.status(204).send();
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Unexpected error during logout';
            res.status(400).json({ error: message });
        }
    };
}
