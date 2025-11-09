import { createClient } from '@supabase/supabase-js';
import type { User, AdminUserAttributes } from '@supabase/supabase-js';
import config from '@media-master/load-dotenv';
import { Database } from '../database.types';
import { ValidationError } from '@utils/validation';

const supabaseAdmin = createClient<Database>(
    config.SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY
);

export type UserResponse = {
    id: string;
    email: string | null;
    name?: string;
    photoUrl?: string;
    isGuest: boolean;
    lastSignIn?: string | null;
    createdAt?: string | null;
};

type UpdateUserInput = {
    email?: string;
    password?: string;
    name?: string;
    isGuest?: boolean;
    photoUrl?: string;
};

export default class UserService {
    private mapUser = (supabaseUser: User): UserResponse => {
        return {
            id: supabaseUser.id,
            email: supabaseUser.email ?? null,
            name: (supabaseUser.user_metadata as { name?: string } | null)?.name,
            photoUrl: (supabaseUser.user_metadata as { photoUrl?: string } | null)
                ?.photoUrl,
            isGuest:
                (supabaseUser.user_metadata as { isGuest?: boolean } | null)?.isGuest ??
                false,
            lastSignIn: supabaseUser.last_sign_in_at ?? null,
            createdAt: supabaseUser.created_at ?? null,
        };
    };

    readAll = async (): Promise<UserResponse[]> => {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error || !data?.users) {
            throw new ValidationError(error?.message ?? 'Could not fetch users');
        }

        return data.users.map((u: User) => this.mapUser(u));
    };

    readById = async (id: string): Promise<UserResponse | null> => {
        const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

        if (error || !data.user) {
            return null;
        }

        return this.mapUser(data.user as User);
    };

    update = async (id: string, data: UpdateUserInput): Promise<UserResponse | null> => {
        const updateData: AdminUserAttributes = {};
        const userMetadata: Record<string, unknown> = {};

        if (typeof data.email !== 'undefined') {
            updateData.email = data.email;
        }

        if (typeof data.password !== 'undefined') {
            updateData.password = data.password;
        }

        if (typeof data.name !== 'undefined') {
            userMetadata.name = data.name;
        }

        if (typeof data.isGuest !== 'undefined') {
            userMetadata.isGuest = data.isGuest;
        }

        if (typeof data.photoUrl !== 'undefined') {
            userMetadata.photoUrl = data.photoUrl;
        }

        if (Object.keys(userMetadata).length > 0) {
            updateData.user_metadata = userMetadata;
        }

        if (Object.keys(updateData).length === 0) {
            throw new ValidationError('No valid fields to update');
        }

        const { data: updatedData, error } =
            await supabaseAdmin.auth.admin.updateUserById(id, updateData);

        if (error || !updatedData.user) {
            throw new ValidationError(error?.message ?? 'Could not update user');
        }

        return this.mapUser(updatedData.user as User);
    };

    delete = async (id: string): Promise<boolean> => {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (error) {
            return false;
        }

        return true;
    };
}
