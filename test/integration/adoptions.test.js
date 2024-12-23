import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import adoptionModel from '../../src/dao/models/Adoption.js';
import userModel from '../../src/dao/models/User.js';
import petModel from '../../src/dao/models/Pet.js';
import { createHash } from '../../src/utils/index.js';
import dotenv from 'dotenv';
import { app, server } from '../../src/app.js';

dotenv.config();

const expect = chai.expect;
const requester = supertest(app);

describe('Adoptions API Integration Tests', function() {
    let authToken;
    let testUserId;
    let testPetId;
    let testAdoptionId;

    this.timeout(5000);

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
            await petModel.deleteMany({});
            await adoptionModel.deleteMany({});
            
            const user = await userModel.create(adminUser);
            testUserId = user._id;

            // Crear mascota de prueba
            const testPet = {
                name: faker.animal.dog(),
                specie: 'Dog',
                birthDate: faker.date.past(),
                adopted: false
            };
            const pet = await petModel.create(testPet);
            testPetId = pet._id;
            
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
            await adoptionModel.deleteMany({});
            await petModel.deleteMany({});
            await userModel.deleteMany({});
            await mongoose.connection.close();
            if (server) {
                server.close();
            }
        } catch (error) {
            console.error('Error in test cleanup:', error);
        }
    });

    describe('GET /api/adoptions', () => {
        it('should return empty array when no adoptions exist', async () => {
            await adoptionModel.deleteMany({});
            
            const response = await requester
                .get('/api/adoptions')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array').that.is.empty;
        });

        it('should return array of adoptions when adoptions exist', async () => {
            const adoption = await adoptionModel.create({
                owner: testUserId,
                pet: testPetId
            });
            testAdoptionId = adoption._id;

            const response = await requester
                .get('/api/adoptions')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(1);
        });
    });

    describe('GET /api/adoptions/:aid', function() {
        it('should get adoption by ID successfully', async function() {
            const adoption = await adoptionModel.create({
                owner: testUserId,
                pet: testPetId
            });
            testAdoptionId = adoption._id;

            const response = await requester
                .get(`/api/adoptions/${testAdoptionId}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.owner.toString()).to.equal(testUserId.toString());
            expect(response.body.payload.pet.toString()).to.equal(testPetId.toString());
        });

        it('should return 404 for non-existent adoption', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await requester
                .get(`/api/adoptions/${fakeId}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Adoption not found');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('should create new adoption successfully', async () => {
            // Crear nueva mascota para adoptar
            const newPet = await petModel.create({
                name: faker.animal.dog(),
                specie: 'Dog',
                birthDate: faker.date.past(),
                adopted: false
            });

            const response = await requester
                .post(`/api/adoptions/${testUserId}/${newPet._id}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Pet adopted');

            // Verificar que la mascota fue marcada como adoptada
            const updatedPet = await petModel.findById(newPet._id);
            expect(updatedPet.adopted).to.be.true;
            expect(updatedPet.owner.toString()).to.equal(testUserId.toString());
        });

        it('should fail when adopting already adopted pet', async () => {
            const adoptedPet = await petModel.create({
                name: faker.animal.dog(),
                specie: 'Dog',
                birthDate: faker.date.past(),
                adopted: true,
                owner: testUserId
            });

            const response = await requester
                .post(`/api/adoptions/${testUserId}/${adoptedPet._id}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Pet is already adopted');
        });

        it('should fail with non-existent user', async () => {
            const fakeUserId = new mongoose.Types.ObjectId();
            const response = await requester
                .post(`/api/adoptions/${fakeUserId}/${testPetId}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('user Not found');
        });

        it('should fail with non-existent pet', async () => {
            const fakePetId = new mongoose.Types.ObjectId();
            const response = await requester
                .post(`/api/adoptions/${testUserId}/${fakePetId}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Pet not found');
        });
    });
}); 