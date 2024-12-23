// src/controllers/pets.controller.js

import { createError } from '../utils/errorHandler.js';
import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllPets = async(req,res)=>{
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const createPet = async(req, res, next) => {
    try {
        const {name, specie, birthDate} = req.body;
        
        if(!name || !specie || !birthDate) {
            return res.status(400).send({
                status: "error",
                error: "Missing required pet data"
            });
        }

        const validSpecies = ['Dog', 'Cat', 'Bird', 'Hamster', 'Rabbit'];
        if (!validSpecies.includes(specie)) {
            return res.status(400).send({
                status: "error",
                error: "Invalid pet species"
            });
        }

        const pet = PetDTO.getPetInputFrom({name, specie, birthDate});
        const result = await petsService.create(pet);
        
        res.send({status: "success", payload: result});
    } catch (error) {
        next(error);
    }
};

const updatePet = async(req,res) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        
        try {
            const result = await petsService.update(petId, petUpdateBody);
            res.send({status:"success", message:"pet updated"});
        } catch (error) {
            if (error.message === 'Pet not found') {
                return res.status(404).send({
                    status: "error",
                    error: "Pet not found"
                });
            }
            throw error;  // Re-throw otros errores
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
};

const deletePet = async(req,res) => {
    try {
        const petId = req.params.pid;
        
        try {
            await petsService.delete(petId);
            res.send({status:"success", message:"pet deleted"});
        } catch (error) {
            if (error.message === 'Pet not found') {
                return res.status(404).send({
                    status: "error",
                    error: "Pet not found"
                });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).send({
            status: "error",
            error: error.message
        });
    }
};

const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    console.log(file);
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
    console.log(pet);
    const result = await petsService.create(pet);
    res.send({status:"success",payload:result})
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}