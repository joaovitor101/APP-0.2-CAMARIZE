import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

import userRoutes from './routes/userRoutes.js';
import fazendaRoutes from './routes/fazendaRoutes.js';
import cativeiroRoutes from './routes/cativeiroRoutes.js';
import camaraoRoutes from './routes/camaraoRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import usuariosxFazendasRoutes from './routes/usuariosxFazendasRoutes.js';
import sensoresxCativeirosRoutes from './routes/sensoresxCativeirosRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import testRoutes from './routes/testRoutes.js';
import parametrosRoutes from './routes/parametrosRoutes.js';

// Carrega todos os modelos para garantir que as coleções sejam criadas
import './models/SensoresxCativeiros.js';
import './models/FazendasxCativeiros.js';
import './models/UsuariosxFazendas.js';

const app = express();

// 🧠 Habilita CORS ANTES de tudo
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001",
    "https://*.vercel.app",
    "https://*.vercel.app/*",
    "https://frontend-kappa-liard-17.vercel.app",
    "https://camarize.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// 🧠 Esses dois devem vir ANTES das rotas
app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: false }));

// 🧪 Log básico para cada requisição
app.use((req, res, next) => {
  console.log('Rota acessada:', req.method, req.url);
  next();
});

// ✅ Registra as rotas
app.use('/users', userRoutes);
app.use('/fazendas', fazendaRoutes);
app.use('/', cativeiroRoutes);
app.use('/', camaraoRoutes);
app.use('/', sensorRoutes);
app.use('/usuariosxfazendas', usuariosxFazendasRoutes);
app.use('/sensoresxcativeiros', sensoresxCativeirosRoutes);
app.use('/notifications', notificationRoutes);
app.use('/test', testRoutes);
app.use('/parametros', parametrosRoutes);
// ✅ Conecta ao MongoDB Atlas
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

// Configurações do Mongoose para MongoDB Atlas
const mongooseOptions = {
  maxPoolSize: 10, // Máximo de conexões no pool
  serverSelectionTimeoutMS: 5000, // Timeout para seleção do servidor
  socketTimeoutMS: 45000, // Timeout para operações de socket
  bufferCommands: true, // Habilita o buffer de comandos para evitar erros de conexão
};

// Função para iniciar o servidor após a conexão com o MongoDB
const startServer = () => {
  const port = 4000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 API rodando em http://localhost:${port}.`);
    console.log('✅ Servidor pronto para receber requisições!');
  });
};

// Conecta ao MongoDB e inicia o servidor
mongoose.connect(mongoUrl, mongooseOptions)
.then(() => {
  console.log("✅ MongoDB Atlas conectado com sucesso!");
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log(`🌐 Host: ${mongoose.connection.host}`);
  
  // Inicia o servidor apenas após a conexão estar estabelecida
  startServer();
})
.catch(err => {
  console.error("❌ Erro na conexão com MongoDB Atlas:", err.message);
  console.error("🔧 Verifique se a string de conexão está correta no arquivo .env");
  process.exit(1); // Encerra a aplicação se não conseguir conectar
});

// Event listeners para monitorar a conexão
mongoose.connection.on('error', (err) => {
  console.error('❌ Erro na conexão MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconectado');
});
