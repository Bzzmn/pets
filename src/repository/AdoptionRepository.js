// src/repository/AdoptionRepository.js

import GenericRepository from "./GenericRepository.js";

export default class AdoptionRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
        if (!dao.getBy || !dao.get) {
            throw new Error('Invalid Adoption DAO');
        }
    }

    getBy = async (params) => {
        try {
            const adoption = await this.dao.getBy(params);
            if (!adoption) {
                const error = new Error('Adoption not found');
                error.status = 404;
                throw error;
            }
            return adoption;
        } catch (error) {
            if (error.status === 404) throw error;
            throw new Error(`Error getting adoption: ${error.message}`);
        }
    }

    create = async (doc) => {
        try {
            return await this.dao.create(doc);
        } catch (error) {
            throw new Error(`Error creating adoption: ${error.message}`);
        }
    }

    update = async (id, doc) => {
        try {
            const result = await this.dao.update(id, doc);
            if (!result) {
                throw new Error('Adoption not found');
            }
            return result;
        } catch (error) {
            throw new Error(`Error updating adoption: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            const result = await this.dao.delete(id);
            if (!result) {
                throw new Error('Adoption not found');
            }
            return result;
        } catch (error) {
            throw new Error(`Error deleting adoption: ${error.message}`);
        }
    }
}