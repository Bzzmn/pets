import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import petModel from '../../src/dao/models/Pet.js';
import userModel from '../../src/dao/models/User.js';
import { createHash } from '../../src/utils/index.js';
import dotenv from 'dotenv';
import { app, server } from '../../src/app.js';
import path from 'path';

dotenv.config();

const expect = chai.expect;
const requester = supertest(app);

describe('Pets API Integration Tests', () => {
    let authToken;
    let testPetId;

    before(async function() {
        this.timeout(5000);
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
            await userModel.create(adminUser);
            
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

    describe('GET /api/pets', () => {
        it('should return empty array when no pets exist', async () => {
            await petModel.deleteMany({});
            
            const response = await requester
                .get('/api/pets')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array').that.is.empty;
        });

        it('should return array of pets when pets exist', async () => {
            const testPet = {
                name: faker.animal.dog(),
                specie: 'Dog',
                birthDate: faker.date.past(),
                adopted: false
            };
            
            await petModel.create(testPet);

            const response = await requester
                .get('/api/pets')
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.lengthOf(1);
            expect(response.body.payload[0]).to.have.property('name', testPet.name);
        });
    });

    describe('POST /api/pets', () => {
        it('should create a new pet successfully', async () => {
            const newPet = {
                name: faker.animal.dog(),
                specie: 'Dog',
                birthDate: faker.date.past()
            };

            const response = await requester
                .post('/api/pets')
                .set('Cookie', authToken)
                .send(newPet);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
            expect(response.body.payload.name).to.equal(newPet.name);

            testPetId = response.body.payload._id;
        });

        it('should fail when creating pet with invalid species', async () => {
            const newPet = {
                name: faker.animal.dog(),
                specie: 'InvalidSpecie',
                birthDate: faker.date.past()
            };

            const response = await requester
                .post('/api/pets')
                .set('Cookie', authToken)
                .send(newPet);

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Invalid pet species');
        });
    });

    describe('POST /api/pets/withimage', () => {
        it('should create a pet with image', async () => {
            const testImagePath = path.join(process.cwd(), 'test', 'resources', 'test-pet-image.jpg');
            
            const response = await requester
                .post('/api/pets/withimage')
                .set('Cookie', authToken)
                .field('name', faker.animal.dog())
                .field('specie', 'Dog')
                .field('birthDate', faker.date.past().toISOString())
                .attach('image', testImagePath);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('image');
            expect(response.body.payload.image).to.be.a('string');
        });
    });

    describe('PUT /api/pets/:pid', () => {
        it('should update pet successfully', async () => {
            const updateData = {
                name: faker.animal.dog(),
                adopted: true
            };

            const response = await requester
                .put(`/api/pets/${testPetId}`)
                .set('Cookie', authToken)
                .send(updateData);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('pet updated');

            // Verificar que los cambios se aplicaron
            const updatedPet = await petModel.findById(testPetId);
            expect(updatedPet.name).to.equal(updateData.name);
            expect(updatedPet.adopted).to.equal(updateData.adopted);
        });

        it('should return 404 for non-existent pet', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await requester
                .put(`/api/pets/${fakeId}`)
                .set('Cookie', authToken)
                .send({ name: 'Updated Name' });

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('Pet not found');
        });
    });

    describe('DELETE /api/pets/:pid', () => {
        it('should delete pet successfully', async () => {
            const response = await requester
                .delete(`/api/pets/${testPetId}`)
                .set('Cookie', authToken);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('pet deleted');

            // Verificar que la mascota fue eliminada
            const deletedPet = await petModel.findById(testPetId);
            expect(deletedPet).to.be.null;
        });
    });
}); 