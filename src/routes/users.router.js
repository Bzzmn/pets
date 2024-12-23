// src/routes/users.router.js

import { Router } from 'express';
import { 
    getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/users.controller.js';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Documentación de rutas
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - cookieAuth: []
 */
router.get('/', authMiddleware, getUsers);

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Get user by ID
 *     security:
 *       - cookieAuth: []
 */
router.get('/:uid', authMiddleware, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 */
router.post('/', createUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Update user
 *     security:
 *       - cookieAuth: []
 */
router.put('/:uid', [authMiddleware, checkRole(['admin', 'user'])], updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Delete user
 *     security:
 *       - cookieAuth: []
 */
router.delete('/:uid', [authMiddleware, checkRole(['admin'])], deleteUser);

export default router;