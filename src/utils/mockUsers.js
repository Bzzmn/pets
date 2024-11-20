// src/utils/mockUsers.js

import { faker } from '@faker-js/faker';
import { createHash } from './index.js';

export const generateMockUsers = async (numUsers) => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: await createHash('coder123'),
            role: Math.random() < 0.5 ? 'user' : 'admin',
            pets: []
        });
    }
    return users;
};
