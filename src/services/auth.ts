import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from '@media-master/load-dotenv';
import { Database } from '../database.types';
import jwt from 'jsonwebtoken';
import errors from '@media-master/http-errors';

const supabaseAdmin = createClient<Database>(
    config.SUPABASE_URL,
    config.SUPABASE_KEY
);

const supabaseGeneric: SupabaseClient = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_KEY
);

type SignupInput = {
    email: string;
    password: string;
    name: string;
    photoUrl?: string;
};

type UserResponse = {
    id: string;
    email: string | null;
    name?: string;
    photoUrl?: string;
    lastSignIn?: string | null;
    createdAt?: string | null;
};

type AuthResponse = {
    token: string;
};

export default class AuthService {
    async signin(email: string, password: string): Promise<AuthResponse> {
        const { data: authData, error: authError } =
            await supabaseAdmin.auth.signInWithPassword({
                email,
                password,
            });
        if (authError || !authData.user) {
            throw errors.badRequest(authError?.message ?? 'Invalid credentials');
        }

        return { token: jwt.sign({ userId: authData.user.id }, config.SECRET, { expiresIn: '7d' }) };
    }

    async signup(input: SignupInput): Promise<UserResponse> {
        const { email, password, name, photoUrl } = input;
        const { data: adminData, error: adminError } =
            await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    name,
                    photoUrl,
                },
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
    }

    async getDetails(userId: string): Promise<UserResponse> {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError || !userData.user) {
            throw userError?.message
                ? errors.badRequest(userError.message)
                : errors.internal('Something unexpected happen');
        }

        return {
            id: userData.user!.id,
            name: userData.user!.user_metadata?.name,
            email: userData.user!.email ?? null,
            lastSignIn: userData.user!.last_sign_in_at ?? null,
            createdAt: userData.user!.created_at ?? null,
            photoUrl: userData.user!.user_metadata?.photoUrl,
        };
    }

    async signout(userId: string): Promise<void> {
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userError || !userData.user) {
            throw errors.internal(userError?.message ?? 'Something unexpected happen');
        }
    }
}
