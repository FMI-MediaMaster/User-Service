import config from '@media-master/load-dotenv';
import jwt from 'jsonwebtoken';
import errors from '@media-master/http-errors';
import { supabase } from '@supabase';
import {
    SignUpInput,
    AuthResponse,
    UserResponse,
} from '@types';

export default class AuthService {
    signin = async (email: string, password: string): Promise<AuthResponse> => {
        const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });
        if (authError || !authData.user) {
            throw errors.badRequest(authError?.message ?? 'Invalid credentials');
        }

        return { token: jwt.sign({ userId: authData.user.id }, config.SECRET, { expiresIn: '7d' }) };
    };

    signup = async (input: SignUpInput): Promise<UserResponse> => {
        const { email, password, name, photoUrl } = input;
        const { data: adminData, error: adminError } =
            await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        photoUrl,
                    },
                }
            });
        if (adminError || !adminData.user) {
            throw errors.badRequest(adminError?.message ?? 'Could not create user');
        }

        return {
            id: adminData.user.id,
            email: adminData.user.email ?? null,
            name: adminData.user.user_metadata?.name,
            photoUrl: adminData.user.user_metadata?.photoUrl,
        };
    };

    signout = async (): Promise<void> => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            throw errors.internal(userError?.message ?? 'Something unexpected happen');
        }
    };
};
