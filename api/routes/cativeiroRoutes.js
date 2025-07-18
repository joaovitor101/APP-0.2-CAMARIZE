import express from "express";
const cativeiroRoutes = express.Router();
import cativeiroController from "../controllers/cativeiroController.js";
import multer from 'multer';
const upload = multer();

// Endpoint para cadastrar cativeiro
cativeiroRoutes.post("/cativeiros", upload.single('foto_cativeiro'), cativeiroController.createCativeiro);
// Endpoint para listar todos os cativeiros
cativeiroRoutes.get("/cativeiros", cativeiroController.getAllCativeiros);
cativeiroRoutes.get("/cativeiros/:id", cativeiroController.getCativeiroById);
cativeiroRoutes.get("/tipos-camarao", cativeiroController.getAllTiposCamarao);

export default cativeiroRoutes; 