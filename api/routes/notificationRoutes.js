import express from "express";
import notificationController from "../controllers/notificationController.js";

const router = express.Router();

// Rota para buscar todas as notificações
router.get("/", notificationController.getNotifications);

// Rota para buscar notificações de um cativeiro específico
router.get("/cativeiro/:cativeiroId", notificationController.getNotificationsByCativeiro);

export default router; 