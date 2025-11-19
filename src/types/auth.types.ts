export type SignUpInput = {
    email: string;
    password: string;
    name: string;
    photoUrl?: string;
};

export type AuthResponse = {
    token: string;
};