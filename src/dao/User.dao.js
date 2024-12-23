import userModel from "./models/User.js";

export default class User {
    get = async (params) => {
        try {
            return await userModel.find(params);
        } catch (error) {
            throw new Error(`Error getting users: ${error.message}`);
        }
    }

    getBy = async (params, options = {}) => {
        try {
            const defaultOptions = {
                maxTimeMS: 60000,
                lean: true
            };
            
            const finalOptions = { ...defaultOptions, ...options };
            
            const result = await userModel.findOne(params)
                .maxTimeMS(finalOptions.maxTimeMS)
                .lean(finalOptions.lean)
                .exec();

            return result;
        } catch (error) {
            if (error.name === 'MongooseError' || error.name === 'MongoError') {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }

    create = async (doc) => {
        try {
            return await userModel.create(doc);
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    update = async (id, doc) => {
        try {
            const result = await userModel.findByIdAndUpdate(id, { $set: doc }, { 
                new: true,
                maxTimeMS: 20000 
            });
            if (!result) {
                throw new Error('User not found');
            }
            return result;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            const result = await userModel.findByIdAndDelete(id, { 
                maxTimeMS: 20000 
            });
            if (!result) {
                throw new Error('User not found');
            }
            return result;
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
} 