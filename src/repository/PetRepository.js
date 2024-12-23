// src/repository/PetRepository.js

import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getPetById = async (id) => {
        try {
            const pet = await this.dao.getBy({ _id: id });
            if (!pet) {
                const error = new Error('Pet not found');
                error.status = 404;
                throw error;
            }
            return pet;
        } catch (error) {
            if (error.status === 404) throw error;
            throw new Error(`Error getting pet by id: ${error.message}`);
        }
    }

    update = async (id, doc) => {
        try {
            // Verificar si la mascota existe antes de actualizar
            await this.getPetById(id);
            const result = await this.dao.update(id, doc);
            return result;
        } catch (error) {
            if (error.message.includes('Pet not found')) {
                const notFoundError = new Error('Pet not found');
                notFoundError.status = 404;
                throw notFoundError;
            }
            throw error;
        }
    }

    delete = async (id) => {
        try {
            // Verificar si la mascota existe antes de eliminar
            await this.getPetById(id);
            const result = await this.dao.delete(id);
            return result;
        } catch (error) {
            if (error.message.includes('Pet not found')) {
                const notFoundError = new Error('Pet not found');
                notFoundError.status = 404;
                throw notFoundError;
            }
            throw error;
        }
    }
}