// src/dao/Adoption.js

import adoptionModel from "./models/Adoption.js";

export default class Adoption {
    get = async (params) => {
        try {
            return await adoptionModel.find(params);
        } catch (error) {
            throw new Error(`Error getting adoptions: ${error.message}`);
        }
    }

    getBy = async (params) => {
        try {
            return await adoptionModel.findOne(params);
        } catch (error) {
            throw new Error(`Error getting adoption: ${error.message}`);
        }
    }

    create = async (doc) => {
        try {
            return await adoptionModel.create(doc);
        } catch (error) {
            throw new Error(`Error creating adoption: ${error.message}`);
        }
    }

    update = async (id, doc) => {
        try {
            const result = await adoptionModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
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
            const result = await adoptionModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Adoption not found');
            }
            return result;
        } catch (error) {
            throw new Error(`Error deleting adoption: ${error.message}`);
        }
    }
}