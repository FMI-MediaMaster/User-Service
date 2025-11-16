import errors from '@media-master/http-errors';

export const validateFromBody = (
    body: Record<string, unknown>,
    fields: string[]
): void => {
    const missing = fields.filter((f) => typeof body[f] === 'undefined');
    if (missing.length > 0) {
        throw errors.badRequest(`Missing fields: ${missing.join(', ')}`);
    }
};
