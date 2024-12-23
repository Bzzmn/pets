import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import userModel from '../../src/dao/models/User.js';
import { createHash } from '../../src/utils/index.js';
import dotenv from 'dotenv';
import { app, server } from '../../src/app.js';

dotenv.config();

const expect = chai.expect;
const requester = supertest(app);

describe('Mocks API Integration Tests', function() {
    this.timeout(5000);
    let authToken;

    before(async function() {
        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect(process.env.MONGODB_URI_TEST);
            console.log('Connected to Test Database');

            // Crear usuario admin para pruebas
            const adminUser = {
                first_name: 'Admin',
                last_name: 'Test',
                email: 'admin@test.com',
                password: await createHash('test123'),
                role: 'admin'
            };
            
            await userModel.deleteMany({});
            const user = await userModel.create(adminUser);
            
            // Login para obtener token
            const loginResponse = await requester
                .post('/api/sessions/login')
                .send({ 
                    email: adminUser.email,
                    password: 'test123'
                });

            authToken = loginResponse.headers['set-cookie'][0];
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

    describe('GET /api/mocks/mockingusers', () => {
        it('should return default number of mock users (100)', async () => {
            const response = await requester
                .get('/api/mocks/mockingusers')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(100);

            // Verificar estructura de usuario mock
            const mockUser = response.body.payload[0];
            expect(mockUser).to.have.property('first_name');
            expect(mockUser).to.have.property('last_name');
            expect(mockUser).to.have.property('email');
            expect(mockUser).to.have.property('role');
        });

        it('should return specified number of mock users', async () => {
            const numUsers = 5;
            const response = await requester
                .get(`/api/mocks/mockingusers?num=${numUsers}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.lengthOf(numUsers);
        });

        it('should fail with invalid number of users', async () => {
            const response = await requester
                .get('/api/mocks/mockingusers?num=invalid')
                .set('Cookie', authToken);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });

        it('should fail with negative number of users', async () => {
            const response = await requester
                .get('/api/mocks/mockingusers?num=-5')
                .set('Cookie', authToken);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('GET /api/mocks/mockingpets', () => {
        it('should return default number of mock pets (100)', async () => {
            const response = await requester
                .get('/api/mocks/mockingpets')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(100);
            expect(response.body.totalPets).to.equal(100);

            const mockPet = response.body.payload[0];
            expect(mockPet).to.have.property('name');
            expect(mockPet).to.have.property('specie');
            expect(mockPet).to.have.property('birthDate');
            expect(mockPet).to.have.property('adopted');
        });

        it('should return specified number of mock pets', async () => {
            const numPets = 5;
            const response = await requester
                .get(`/api/mocks/mockingpets?num=${numPets}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.lengthOf(numPets);
        });

        it('should fail with invalid number of pets', async () => {
            const response = await requester
                .get('/api/mocks/mockingpets?num=invalid')
                .set('Cookie', authToken);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
        });
    });

    describe('POST /api/mocks/generateData', () => {
        it('should generate and insert mock data', async () => {
            const response = await requester
                .post('/api/mocks/generateData')
                .set('Cookie', authToken)
                .send({
                    users: 5,
                    pets: 10
                });

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('5 users and 10 pets inserted into the database');
        });

        // ... más tests de generateData ...
    });
}); 