import express from "express";
import { verifyToken, verifyAdminRole }  from '../middlewares/authentication';
import { getAllUser, createUser, updateUser, deleteUser } from '../controllers/userController';

const appUserRoute = express();

// GET
appUserRoute.get('/user', verifyToken, getAllUser);

// POST
appUserRoute.post('/user', [verifyToken, verifyAdminRole], createUser);

// PUT
appUserRoute.put('/user/:id', [verifyToken, verifyAdminRole], updateUser);

// DELETE
appUserRoute.delete('/user/:id', [verifyToken, verifyAdminRole], deleteUser);

export default appUserRoute;