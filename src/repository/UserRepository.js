// src/repository/UserRepository.js

import GenericRepository from "./GenericRepository.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
        if (!dao.get || !dao.getBy) {
            throw new Error('Invalid User DAO');
        }
    }
    
    getUsers = async () => {
        try {
            return await this.dao.get({});
        } catch (error) {
            throw new Error(`Error getting users: ${error.message}`);
        }
    }

    getUserByEmail = async (email) => {
        try {
            const user = await this.dao.getBy({ email });
            if (!user) {
                const error = new Error("User doesn't exist");
                error.status = 404;
                throw error;
            }
            return user;
        } catch (error) {
            if (error.status === 404) throw error;
            throw new Error(`Error getting user by email: ${error.message}`);
        }
    }

    getUserById = async (id) => {
        try {
            const user = await this.dao.getBy({ _id: id });
            if (!user) {
                const error = new Error('user Not found');
                error.status = 404;
                throw error;
            }
            return user;
        } catch (error) {
            if (error.status === 404) throw error;
            throw new Error(`Error getting user by id: ${error.message}`);
        }
    }

    create = async (userData) => {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await this.dao.getBy({ email: userData.email });
            if (existingUser) {
                const error = new Error('User already exists');
                error.status = 400;
                throw error;
            }

            return await this.dao.create(userData);
        } catch (error) {
            if (error.status) throw error;
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    update = async (id, userData) => {
        try {
            // Verificar si el usuario existe
            const existingUser = await this.dao.getBy({ _id: id });
            if (!existingUser) {
                const error = new Error('User not found');
                error.status = 404;
                throw error;
            }

            return await this.dao.update(id, userData);
        } catch (error) {
            if (error.status) throw error;
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            // Verificar si el usuario existe
            const existingUser = await this.dao.getBy({ _id: id });
            if (!existingUser) {
                const error = new Error('User not found');
                error.status = 404;
                throw error;
            }

            return await this.dao.delete(id);
        } catch (error) {
            if (error.status) throw error;
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
}