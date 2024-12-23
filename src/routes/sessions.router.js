// src/routes/sessions.router.js

import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.post('/login', sessionsController.login);
router.post('/register', sessionsController.register);
router.get('/current', sessionsController.current);
router.post('/unprotectedLogin', sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent', sessionsController.unprotectedCurrent);

export default router;