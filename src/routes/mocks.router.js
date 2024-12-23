// src/routes/mocks.router.js

import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingusers', mocksController.getMockUsers);
router.get('/mockingpets', mocksController.getMockPets);
router.post('/generateData', mocksController.generateData);

export default router;
