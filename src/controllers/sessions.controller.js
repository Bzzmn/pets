// src/controllers/sessions.controller.js

import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import config from '../config/config.js';
import { logger } from '../utils/logger.js';

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({ 
                status: "error", 
                error: "Incomplete values" 
            });
        }

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        };

        try {
            const result = await usersService.create(user);
            return res.status(200).send({ 
                status: "success", 
                payload: result._id 
            });
        } catch (error) {
            // Si el usuario ya existe, retornar 400
            if (error.message === 'User already exists') {
                return res.status(400).send({ 
                    status: "error", 
                    error: error.message 
                });
            }
            throw error;
        }

    } catch (error) {
        logger.error('Error in register:', error);
        res.status(500).send({ 
            status: "error", 
            error: error.message 
        });
    }
};

const generateToken = (user) => {
    return jwt.sign({
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        email: user.email
    }, config.jwtSecret, { expiresIn: '1h' });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ 
                status: "error", 
                error: "Incomplete values" 
            });
        }

        try {
            const user = await usersService.getUserByEmail(email);
            if (!user) {
                return res.status(404).send({ 
                    status: "error", 
                    error: "User doesn't exist" 
                });
            }

            const isValidPassword = await passwordValidation(user, password);
            if (!isValidPassword) {
                return res.status(400).send({ 
                    status: "error", 
                    error: "Incorrect password" 
                });
            }

            const token = generateToken(user);
            res.cookie(config.cookieName, token, {
                maxAge: 3600000,
                httpOnly: true
            }).send({ status: "success", message: "Logged in" });

        } catch (error) {
            // Si el error tiene status, usarlo
            if (error.status) {
                return res.status(error.status).send({
                    status: "error",
                    error: error.message
                });
            }
            throw error;
        }
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).send({ 
            status: "error", 
            error: error.message 
        });
    }
};

const current = async(req,res) => {
    try {
        const cookie = req.cookies[config.cookieName];
        if (!cookie) {
            return res.status(401).send({
                status: "error",
                error: "No authentication token provided"
            });
        }

        try {
            const user = jwt.verify(cookie, config.jwtSecret);
            return res.send({
                status: "success",
                payload: user
            });
        } catch (jwtError) {
            return res.status(401).send({
                status: "error",
                error: "Invalid or expired token"
            });
        }
    } catch (error) {
        logger.error('Error in current user:', error);
        return res.status(500).send({
            status: "error",
            error: error.message
        });
    }
};

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}