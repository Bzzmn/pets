import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import userModel from '../../src/dao/models/User.js';
import { createHash } from '../../src/utils/index.js';
import dotenv from 'dotenv';
import { app, server } from '../../src/app.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const expect = chai.expect;
const requester = supertest(app);

describe('Authentication API Integration Tests', function() {
    this.timeout(5000);
    let authToken;

    before(async function() {
        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect(process.env.MONGODB_URI_TEST);
            console.log('Connected to Test Database');
            await userModel.deleteMany({});
        } catch (error) {
            console.error('Error in test setup:', error);
            throw error;
        }
    });

    after(async () => {
        try {
            await userModel.deleteMany({});
            await mongoose.connection.close();
            if (server) {
                server.close();
            }
        } catch (error) {
            console.error('Error in test cleanup:', error);
        }
    });

    describe('POST /api/sessions/register', () => {
        it('should register a new user successfully', async () => {
            const newUser = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: 'Test123'
            };

            const response = await requester
                .post('/api/sessions/register')
                .send(newUser);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body).to.have.property('payload');

            // Verificar que el usuario fue creado en la base de datos
            const userInDb = await userModel.findOne({ email: newUser.email });
            expect(userInDb).to.exist;
            expect(userInDb.email).to.equal(newUser.email);
        });

        it('should fail when registering with existing email', async () => {
            const existingUser = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: 'existing@test.com',
                password: await createHash('test123')
            };

            await userModel.create(existingUser);

            const response = await requester
                .post('/api/sessions/register')
                .send({
                    ...existingUser,
                    password: 'test123' // Sin hashear para el request
                });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('User already exists');
        });

        it('should fail when registering with incomplete data', async () => {
            const incompleteUser = {
                first_name: faker.person.firstName(),
                email: faker.internet.email()
                // Falta last_name y password
            };

            const response = await requester
                .post('/api/sessions/register')
                .send(incompleteUser);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Incomplete values');
        });
    });

    describe('POST /api/sessions/login', () => {
        let testUser;

        beforeEach(async () => {
            // Crear usuario de prueba
            testUser = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: 'test123'
            };

            const hashedPassword = await createHash(testUser.password);
            await userModel.create({
                ...testUser,
                password: hashedPassword
            });
        });

        it('should login successfully with correct credentials', async () => {
            const response = await requester
                .post('/api/sessions/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Logged in');
            expect(response.headers['set-cookie']).to.exist;

            // Guardar token para otros tests
            authToken = response.headers['set-cookie'][0];
        });

        it('should fail with incorrect password', async () => {
            const response = await requester
                .post('/api/sessions/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Incorrect password');
        });

        it('should fail with non-existent user', async () => {
            const response = await requester
                .post('/api/sessions/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: 'test123'
                });

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal("User doesn't exist");
        });
    });

    describe('GET /api/sessions/current', () => {
        it('should get current user with valid token', async () => {
            const response = await requester
                .get('/api/sessions/current')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('email');
            expect(response.body.payload).to.have.property('role');
        });

        it('should fail without token', async () => {
            const response = await requester
                .get('/api/sessions/current')
                .set('Cookie', []);

            expect(response.status).to.equal(401);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('No authentication token provided');
        });

        it('should fail with invalid token', async () => {
            const response = await requester
                .get('/api/sessions/current')
                .set('Cookie', ['coderCookie=invalid.token.here']);

            expect(response.status).to.equal(401);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Invalid or expired token');
        });
    });
}); 