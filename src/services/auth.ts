import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from '@media-master/load-dotenv';
import { Database } from '../database.types';
import { createJwt, TokenPayload } from '@utils/jwt';
import { ValidationError } from '@utils/validation';

const supabaseAdmin = createClient<Database>(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseGeneric: SupabaseClient = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY
);

type SignupInput = {
    email: string;
    password: string;
    name: string;
    isGuest: boolean;
    photoUrl?: string;
};

type UserResponse = {
    id: string;
    email: string | null;
    name?: string;
    photoUrl?: string;
    isGuest: boolean;
    lastSignIn?: string | null;
    createdAt?: string | null;
};

type AuthResponse = {
    token: string;
    user: UserResponse;
};

export default class AuthService {
    async login(email: string, password: string): Promise<AuthResponse> {
        const { data: authData, error: authError } =
            await supabaseAdmin.auth.signInWithPassword({
                email,
                password,
            });

        if (authError || !authData.user) {
            throw new ValidationError(authError?.message ?? 'Invalid credentials');
        }

        const supabaseUser = authData.user;
        const accessToken = createJwt({ userId: supabaseUser.id } as TokenPayload);

        const publicUser: UserResponse = {
            id: supabaseUser.id,
            email: supabaseUser.email ?? null,
            name: supabaseUser.user_metadata?.name,
            photoUrl: supabaseUser.user_metadata?.photoUrl,
            isGuest: supabaseUser.user_metadata?.isGuest ?? false,
            lastSignIn: supabaseUser.last_sign_in_at ?? null,
            createdAt: supabaseUser.created_at ?? null,
        };

        return {
            token: accessToken,
            user: publicUser,
        };
    }

    async signup(input: SignupInput): Promise<UserResponse> {
        const { email, password, name, isGuest, photoUrl } = input;

        const { data: adminData, error: adminError } =
            await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    name,
                    isGuest,
                    photoUrl,
                },
            });

        if (adminError || !adminData.user) {
            throw new ValidationError(adminError?.message ?? 'Could not create user');
        }

        const createdSupabaseUser = adminData.user;

        const publicUser: UserResponse = {
            id: createdSupabaseUser.id,
            email: createdSupabaseUser.email ?? null,
            name: createdSupabaseUser.user_metadata?.name,
            isGuest: createdSupabaseUser.user_metadata?.isGuest ?? false,
            photoUrl: createdSupabaseUser.user_metadata?.photoUrl,
        };

        return publicUser;
    }

    async getDetails(userId: string): Promise<UserResponse | null> {
        const { data: userData, error: userError } =
            await supabaseAdmin.auth.admin.getUserById(userId);

        if (userError || !userData.user) {
            return null;
        }

        const supabaseUser = userData.user;

        const publicUser: UserResponse = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name,
            email: supabaseUser.email ?? null,
            lastSignIn: supabaseUser.last_sign_in_at ?? null,
            createdAt: supabaseUser.created_at ?? null,
            photoUrl: supabaseUser.user_metadata?.photoUrl,
            isGuest: supabaseUser.user_metadata?.isGuest ?? false,
        };

        return publicUser;
    }

    async logout(userId: string): Promise<void> {
        const { data: userData, error: userError } =
            await supabaseAdmin.auth.admin.getUserById(userId);

        if (userError || !userData.user) {
            return;
        }

        const supabaseUser = userData.user;
        const isGuestUser = !!supabaseUser.user_metadata?.isGuest;

        if (!isGuestUser) {
            return;
        }

        const tableNames = [
            'note',
            'usertag',
            'wishlist',
            'mediauser',
            'mediausertag',
            'userachievement',
            'mediausersource',
        ];

        await Promise.all(
            tableNames.map((tableName) =>
                supabaseGeneric.from(tableName).delete().eq('userid', userId)
            )
        );

        await supabaseAdmin.auth.admin.deleteUser(userId);
    }
}
