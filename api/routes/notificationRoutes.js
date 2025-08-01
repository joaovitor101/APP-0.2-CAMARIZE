import express from "express";
import notificationController from "../controllers/notificationController.js";
import Auth from "../middleware/Auth.js";

const router = express.Router();

// Rota para buscar todas as notificações
router.get("/", Auth.Authorization, notificationController.getNotifications);

// Rota para buscar notificações de um cativeiro específico
router.get("/cativeiro/:cativeiroId", Auth.Authorization, notificationController.getNotificationsByCativeiro);

export default router; 