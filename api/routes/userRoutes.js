import express from "express";
const userRoutes = express.Router();
import userController from "../controllers/userController.js";

// Endpoint para cadastrar um usuário
userRoutes.post("/user", userController.createUser);

// Endpoint para autenticação (login) do usuário
userRoutes.post("/auth", userController.loginUser);

// Endpoint para cadastro completo (usuário + sitio)
userRoutes.post("/register", userController.register);


userRoutes.get('/:id', userController.getUserById);

export default userRoutes;