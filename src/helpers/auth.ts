import { Request } from 'express';
import { ValidationError } from '@utils/validation';

export function extractBearerToken(req: Request): string {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        throw new ValidationError('Missing or invalid token');
    }

    return authorizationHeader.substring('Bearer '.length);
}
