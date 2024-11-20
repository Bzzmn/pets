// src/repository/PetRepository.js

import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }
}