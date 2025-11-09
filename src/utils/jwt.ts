import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '@media-master/load-dotenv';

const JWT_SECRET = config.JWT_SECRET || 'random';

export interface TokenPayload extends JwtPayload {
    userId: string;
}

export const createJwt = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyJwt = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
