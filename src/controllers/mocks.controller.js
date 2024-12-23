import { generateMockUsers } from '../mocks/users.mock.js';
import { generateMockPets } from '../mocks/pets.mock.js';
import { usersService, petsService } from '../services/index.js';

const getMockUsers = async (req, res) => {
    try {
        const num = req.query.num ? parseInt(req.query.num) : 100;

        if (req.query.num && (isNaN(num) || !Number.isInteger(Number(req.query.num)))) {
            return res.status(400).send({
                status: 'error',
                error: 'Invalid number format'
            });
        }

        if (num <= 0) {
            return res.status(400).send({
                status: 'error',
                error: 'Number must be positive'
            });
        }

        const users = await generateMockUsers(num);
        res.send({
            status: 'success',
            payload: users
        });
    } catch (error) {
        console.error('Error generating mock users:', error);
        res.status(500).send({
            status: 'error',
            error: error.message
        });
    }
};

const getMockPets = async (req, res) => {
    try {
        const num = req.query.num ? parseInt(req.query.num) : 100;

        if (req.query.num && (isNaN(num) || !Number.isInteger(Number(req.query.num)))) {
            return res.status(400).send({
                status: 'error',
                error: 'Invalid number format'
            });
        }

        if (num <= 0) {
            return res.status(400).send({
                status: 'error',
                error: 'Number must be positive'
            });
        }

        const pets = generateMockPets(num);
        res.send({
            status: 'success',
            payload: pets,
            totalPets: pets.length
        });
    } catch (error) {
        console.error('Error generating mock pets:', error);
        res.status(500).send({
            status: 'error',
            error: error.message
        });
    }
};

const generateData = async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        if (!Number.isInteger(Number(users)) || !Number.isInteger(Number(pets))) {
            return res.status(400).send({
                status: 'error',
                error: 'Users and pets must be integers'
            });
        }

        if (users < 0 || pets < 0) {
            return res.status(400).send({
                status: 'error',
                error: 'Numbers cannot be negative'
            });
        }

        const mockUsers = await generateMockUsers(users);
        const mockPets = generateMockPets(pets);

        await Promise.all([
            ...mockUsers.map(user => usersService.create(user)),
            ...mockPets.map(pet => petsService.create(pet))
        ]);

        res.send({
            status: 'success',
            message: `${users} users and ${pets} pets inserted into the database`
        });
    } catch (error) {
        console.error('Error generating data:', error);
        res.status(500).send({
            status: 'error',
            error: error.message
        });
    }
};

export default {
    getMockUsers,
    getMockPets,
    generateData
}; 