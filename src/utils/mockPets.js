import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

export const generateMockPets = (numPets) => {
    const pets = [];
    
    for (let i = 0; i < numPets; i++) {
        pets.push({
            _id: new mongoose.Types.ObjectId(),
            name: faker.person.firstName(),
            specie: faker.helpers.arrayElement(['Dog', 'Cat', 'Bird', 'Hamster', 'Rabbit']),
            birthDate: faker.date.past({ years: 10 }),
            adopted: false,
            owner: null,
            image: faker.image.urlLoremFlickr({ category: 'animals' }),
            __v: 0
        });
    }
    
    return pets;
};
