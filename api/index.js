import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import fazendaRoutes from './routes/fazendaRoutes.js';

const app = express();

// 🧠 Habilita CORS ANTES de tudo
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🧠 Esses dois devem vir ANTES das rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🧪 Log básico para cada requisição
app.use((req, res, next) => {
  console.log('Rota acessada:', req.method, req.url);
  next();
});

// ✅ Registra as rotas
app.use('/', userRoutes);
app.use('/', gameRoutes);
app.use('/', fazendaRoutes);

// ✅ Conecta ao Mongo
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";
mongoose.connect(mongoUrl)
.then(() => {
  console.log("MongoDB conectado com sucesso!");
})
.catch(err => {
  console.error("Erro na conexão:", err);
});

const port = 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`API rodando em http://localhost:${port}.`);
});
