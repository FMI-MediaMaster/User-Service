export type UserResponse = {
    id: string;
    email: string | null;
    name?: string;
    photoUrl?: string;
    lastSignIn?: string | null;
    createdAt?: string | null;
};

export type UpdateUserInput = {
    email?: string;
    password?: string;
    name?: string;
    photoUrl?: string;
};