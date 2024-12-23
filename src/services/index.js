// src/services/index.js

import UserRepository from '../repository/UserRepository.js';
import PetRepository from '../repository/PetRepository.js';
import AdoptionRepository from '../repository/AdoptionRepository.js';
import User from '../dao/User.dao.js';
import Pet from '../dao/Pets.dao.js';
import Adoption from '../dao/Adoptions.dao.js';

// Instanciar DAOs
const userDao = new User();
const petDao = new Pet();
const adoptionDao = new Adoption();

// Instanciar Repositories con sus respectivos DAOs
const userRepository = new UserRepository(userDao);
const petRepository = new PetRepository(petDao);
const adoptionRepository = new AdoptionRepository(adoptionDao);

// Exportar los repositories como servicios
export const usersService = {
    getUsers: () => userRepository.getUsers(),
    getUserById: (id) => userRepository.getUserById(id),
    getUserByEmail: (email) => userRepository.getUserByEmail(email),
    create: (userData) => userRepository.create(userData),
    update: (id, userData) => userRepository.update(id, userData),
    delete: (id) => userRepository.delete(id)
};

export const petsService = petRepository;
export const adoptionsService = adoptionRepository;
