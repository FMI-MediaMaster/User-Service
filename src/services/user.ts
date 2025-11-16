import type { User, AdminUserAttributes } from '@supabase/supabase-js';
import errors from '@media-master/http-errors';
import {
    supabase,
    supabaseAdmin,
} from '@supabase';
import {
    UserResponse,
    UpdateUserInput,
} from '@types';

export default class UserService {
    private mapUser = (supabaseUser: User): UserResponse => {
        return {
            id: supabaseUser.id,
            email: supabaseUser.email ?? null,
            name: (supabaseUser.user_metadata as { name?: string } | null)?.name,
            photoUrl: (supabaseUser.user_metadata as { photoUrl?: string } | null)?.photoUrl,
            lastSignIn: supabaseUser.last_sign_in_at ?? null,
            createdAt: supabaseUser.created_at ?? null,
        };
    };

    read = async (): Promise<UserResponse> => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            throw userError?.message
                ? errors.badRequest(userError.message)
                : errors.internal('Something unexpected happen');
        }

        return this.mapUser(userData.user!);
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

        if (typeof data.photoUrl !== 'undefined') {
            userMetadata.photoUrl = data.photoUrl;
        }

        if (Object.keys(userMetadata).length > 0) {
            updateData.user_metadata = userMetadata;
        }

        if (Object.keys(updateData).length === 0) {
            throw errors.badRequest('No valid fields to update');
        }

        const { data: updatedData, error } =
            await supabaseAdmin.auth.admin.updateUserById(id, updateData);

        if (error || !updatedData.user) {
            throw errors.internal('Could not update user');
        }

        return this.mapUser(updatedData.user as User);
    };

    delete = async (id: string): Promise<boolean> => {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
        return !error;
    };
}
