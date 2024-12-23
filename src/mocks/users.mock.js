import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';

export const generateMockUser = async () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await createHash('test123'),
        role: faker.helpers.arrayElement(['user', 'admin']),
        pets: []
    };
};

export const generateMockUsers = async (quantity = 100) => {
    if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Invalid quantity for mock users');
    }
    return Promise.all(Array.from({ length: quantity }, () => generateMockUser()));
}; 