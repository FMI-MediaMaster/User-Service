export type SignupInput = {
    email: string;
    password: string;
    name: string;
    photoUrl?: string;
};

export type AuthResponse = {
    token: string;
};