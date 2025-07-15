import express from "express";
const fazendaRoutes = express.Router();
import fazendaController from "../controllers/fazendaController.js";

// Endpoint para cadastrar uma fazenda
fazendaRoutes.all("/register-farm", (req, res, next) => {
    console.log("Chegou em /register-farm via", req.method);
    next();
  });
fazendaRoutes.post("/register-farm", fazendaController.createFarm);
// Endpoint para listar todas as fazendas
fazendaRoutes.get("/fazendas", fazendaController.getAllFarms);

export default fazendaRoutes; 