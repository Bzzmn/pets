// src/dao/Pets.dao.js

import petModel from "./models/Pet.js";

export default class Pet {
    get = async (params) => {
        try {
            return await petModel.find(params);
        } catch (error) {
            throw new Error(`Error getting pets: ${error.message}`);
        }
    }

    getBy = async (params) => {
        try {
            return await petModel.findOne(params);
        } catch (error) {
            throw new Error(`Error getting pet: ${error.message}`);
        }
    }

    create = async (doc) => {
        try {
            return await petModel.create(doc);
        } catch (error) {
            throw new Error(`Error creating pet: ${error.message}`);
        }
    }

    update = async (id, doc) => {
        try {
            const result = await petModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
            if (!result) {
                throw new Error('Pet not found');
            }
            return result;
        } catch (error) {
            throw new Error(`Error updating pet: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            const result = await petModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Pet not found');
            }
            return result;
        } catch (error) {
            throw new Error(`Error deleting pet: ${error.message}`);
        }
    }
}