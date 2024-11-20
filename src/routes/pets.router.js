import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import { generateMockPets } from '../utils/mockPets.js';

const router = Router();

router.get('/', petsController.getAllPets);
router.post('/', petsController.createPet);
router.post('/withimage', uploader.single('image'), petsController.createPetWithImage);
router.put('/:pid', petsController.updatePet);
router.delete('/:pid', petsController.deletePet);

router.get('/mockingpets', (req, res) => {
    const numPets = parseInt(req.query.num) || 100;
    const mockPets = generateMockPets(numPets);
    res.send({ status: 'success', payload: mockPets });
});

export default router;
