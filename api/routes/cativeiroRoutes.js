import express from "express";
const cativeiroRoutes = express.Router();
import cativeiroController from "../controllers/cativeiroController.js";
import multer from 'multer';
const upload = multer();
import Auth from '../middleware/Auth.js';

// Endpoint para cadastrar cativeiro
cativeiroRoutes.post("/cativeiros", Auth.Authorization, upload.single('foto_cativeiro'), cativeiroController.createCativeiro);
// Endpoint para listar todos os cativeiros
cativeiroRoutes.get("/cativeiros", Auth.Authorization, cativeiroController.getAllCativeiros);
cativeiroRoutes.get("/cativeiros/:id", cativeiroController.getCativeiroById);
cativeiroRoutes.get("/tipos-camarao", cativeiroController.getAllTiposCamarao);
// Endpoint para atualizar cativeiro
cativeiroRoutes.put("/cativeiros/:id", Auth.Authorization, upload.single('foto_cativeiro'), cativeiroController.updateCativeiro);
// Endpoint para deletar cativeiro
cativeiroRoutes.delete("/cativeiros/:id", Auth.Authorization, cativeiroController.deleteCativeiro);

export default cativeiroRoutes; 