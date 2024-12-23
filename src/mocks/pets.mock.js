import { faker } from '@faker-js/faker';

export const generateMockPet = () => {
    return {
        name: faker.animal.dog(),
        specie: faker.helpers.arrayElement(['Dog', 'Cat', 'Bird', 'Hamster', 'Rabbit']),
        birthDate: faker.date.past(),
        adopted: faker.datatype.boolean(),
        image: faker.image.url()
    };
};

export const generateMockPets = (quantity = 100) => {
    if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Invalid quantity for mock pets');
    }
    return Array.from({ length: quantity }, generateMockPet);
}; 