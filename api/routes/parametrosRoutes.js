import express from "express";
import { getParametrosAtuais, getParametrosHistoricos, getDadosDashboard } from "../controllers/parametrosController.js";
import Auth from "../middleware/Auth.js";

const router = express.Router();

// Rota para buscar dados atuais de um cativeiro
router.get("/atuais/:cativeiroId", Auth.Authorization, getParametrosAtuais);

// Rota para buscar dados históricos de um cativeiro
router.get("/historicos/:cativeiroId", Auth.Authorization, getParametrosHistoricos);

// Rota para buscar dados completos do dashboard
router.get("/dashboard/:cativeiroId", Auth.Authorization, getDadosDashboard);

export default router; 