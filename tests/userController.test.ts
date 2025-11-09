import request from 'supertest';
import { Express } from 'express';
import { describe, it, expect } from 'vitest';
import app from '../src/app';

describe('UserController', () => {
    it('GET /users should return a list of users', async () => {
        const res: request.Response = await request(app as Express).get('/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /users should create a user', async () => {
        const res: request.Response = await request(app as Express)
            .post('/users')
            .send({ name: 'Charlie' });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Charlie');
    });
});
