export class ValidationError extends Error {
    status = 400;

    constructor(message: string) {
        super(message);
    }
}

export const validateFromBody = (
    body: Record<string, unknown>,
    fields: string[]
): void => {
    const missing = fields.filter((f) => typeof body[f] === 'undefined');
    if (missing.length > 0) {
        throw new ValidationError(`Missing fields: ${missing.join(', ')}`);
    }
};
