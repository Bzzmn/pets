// src/repository/GenericRepository.js

export default class GenericRepository {
    constructor(dao) {
        if (!dao) throw new Error('DAO is required');
        this.dao = dao;
    }

    getAll = async (params) => {
        try {
            return await this.dao.get(params);
        } catch (error) {
            throw new Error(`Error in Repository: ${error.message}`);
        }
    }

    getBy = async (params) => {
        try {
            return await this.dao.getBy(params);
        } catch (error) {
            throw new Error(`Error getting by params: ${error.message}`);
        }
    }

    create = async (doc) => {
        try {
            return await this.dao.create(doc);
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

    update = async (id, doc) => {
        try {
            return await this.dao.update(id, doc);
        } catch (error) {
            throw new Error(`Error updating document: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            throw new Error(`Error deleting document: ${error.message}`);
        }
    }
}