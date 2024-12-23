// src/controllers/users.controller.js

import { usersService } from "../services/index.js"
import { logger } from "../utils/logger.js"

export const getUsers = async(req,res) => {
    try {
        const users = await usersService.getUsers();
        res.send({ status: 'success', payload: users });
    } catch (error) {
        logger.error('Error getting users:', error);
        res.status(500).send({ 
            status: 'error', 
            error: error.message 
        });
    }
}

export const getUserById = async(req,res) => {
    try {
        const user = await usersService.getUserById(req.params.uid);
        if (!user) {
            return res.status(404).send({ 
                status: 'error', 
                error: 'User not found' 
            });
        }
        res.send({ status: 'success', payload: user });
    } catch (error) {
        logger.error('Error getting user:', error);
        res.status(500).send({ 
            status: 'error', 
            error: error.message 
        });
    }
}

export const createUser = async(req,res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({ 
                status: 'error', 
                error: 'Missing required fields' 
            });
        }

        const user = await usersService.createUser({
            first_name,
            last_name,
            email,
            password
        });

        res.send({ status: 'success', payload: user });
    } catch (error) {
        logger.error('Error creating user:', error);
        res.status(error.status || 500).send({ 
            status: 'error', 
            error: error.message 
        });
    }
}

export const updateUser = async(req,res) => {
    try {
        const { uid } = req.params;
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({ 
                status: 'error', 
                error: 'No data provided for update' 
            });
        }

        const updatedUser = await usersService.updateUser(uid, updateData);
        res.send({ status: 'success', payload: updatedUser });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(error.status || 500).send({ 
            status: 'error', 
            error: error.message 
        });
    }
}

export const deleteUser = async(req,res) => {
    try {
        const { uid } = req.params;
        await usersService.deleteUser(uid);
        res.send({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(error.status || 500).send({ 
            status: 'error', 
            error: error.message 
        });
    }
}