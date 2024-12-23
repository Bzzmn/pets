// src/controllers/adoptions.controller.js

import { adoptionsService, petsService, usersService } from "../services/index.js"
import { logger } from '../utils/logger.js';

const getAllAdoptions = async(req,res) => {
    try {
        const result = await adoptionsService.getAll();
        res.send({status:"success", payload:result});
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
}

const getAdoption = async(req,res) => {
    try {
        const adoptionId = req.params.aid;
        try {
            const adoption = await adoptionsService.getBy({_id:adoptionId});
            res.send({status:"success", payload:adoption});
        } catch (error) {
            // Si el error tiene status 404, enviamos 404
            if (error.status === 404) {
                return res.status(404).send({
                    status: "error",
                    error: "Adoption not found"
                });
            }
            throw error; // Re-lanzar otros errores
        }
    } catch (error) {
        console.error('Error getting adoption:', error);
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
}

const createAdoption = async(req,res) => {
    try {
        const { uid, pid } = req.params;

        try {
            const user = await usersService.getUserById(uid);
            if (!user) {
                return res.status(404).send({
                    status: "error",
                    error: "user Not found"
                });
            }

            const pet = await petsService.getPetById(pid);
            if (!pet) {
                return res.status(404).send({
                    status: "error",
                    error: "Pet not found"
                });
            }

            if(pet.adopted) {
                return res.status(400).send({
                    status:"error",
                    error:"Pet is already adopted"
                });
            }

            user.pets.push(pet._id);
            await usersService.update(user._id, {pets:user.pets});
            await petsService.update(pet._id, {adopted:true, owner:user._id});
            await adoptionsService.create({owner:user._id, pet:pet._id});
            
            res.send({status:"success", message:"Pet adopted"});
        } catch (error) {
            // Propagar el código de estado si existe
            if (error.status) {
                return res.status(error.status).send({
                    status: 'error',
                    error: error.message
                });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Error creating adoption:', error);
        res.status(500).send({
            status: 'error',
            error: error.message
        });
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}