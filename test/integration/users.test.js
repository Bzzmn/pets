import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../src/app.js';
import userModel from '../../src/dao/models/User.js';
import { createHash } from '../../src/utils/index.js';
import config from '../../src/config/config.js';

const expect = chai.expect;
const requester = supertest(app);

describe('Users API Integration Tests', function() {
    let authToken;

    before(async function() {
        this.timeout(10000);
        
        try {
            await mongoose.connect(config.mongoUrl);
            console.log('Connected to Test Database');

            await userModel.deleteMany({});

            const adminUser = {
                first_name: 'Admin',
                last_name: 'Test',
                email: 'admin@test.com',
                password: await createHash('test123'),
                role: 'admin'
            };

            await userModel.create(adminUser);

            const loginResponse = await requester
                .post('/api/sessions/login')
                .send({
                    email: 'admin@test.com',
                    password: 'test123'
                });

            if (loginResponse.status === 200 && loginResponse.headers['set-cookie']) {
                const cookieString = loginResponse.headers['set-cookie'][0];
                authToken = cookieString.split(';')[0];
                console.log('Login successful, token received:', authToken);
            } else {
                console.error('Login response:', loginResponse.body);
                throw new Error('Failed to get auth token');
            }
        } catch (error) {
            console.error('Setup error:', error);
            throw error;
        }
    });

    after(async function() {
        try {
            await userModel.deleteMany({});
            await mongoose.connection.close();
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    });

    describe('GET /api/users', () => {
        beforeEach(async () => {
            await userModel.deleteMany({ email: { $ne: 'admin@test.com' } });
        });

        it('should return array with admin when no other users exist', async () => {
            const response = await requester
                .get('/api/users')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(1);
        });

        it('should return array of users when users exist', async () => {
            const testUser = {
                first_name: 'Test',
                last_name: 'User',
                email: 'test@user.com',
                password: await createHash('test123'),
                role: 'user'
            };

            await userModel.create(testUser);

            const response = await requester
                .get('/api/users')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(2);
        });
    });

    // ... resto de los tests ...
}); 