import express from "express";
import mongoose from "mongoose";
import Games from "./models/Games.js"
import User from "./models/Users.js"
import cors from "cors"
const app = express();

// Importando as rotas (endpoints) de Games
import gameRoutes from './routes/gameRoutes.js'
// Importando as rotas (endpoints) de Usuários
import userRoutes from './routes/userRoutes.js'

// Configurações do Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//
app.use(cors())

app.use('/', gameRoutes)
app.use('/', userRoutes)

// Iniciando a conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://mongo-api:27017/camarize")
//mongoose.connect("mongodb://localhost:27017/camarize")
.then(() => {
  console.log("MongoDB conectado com sucesso!");
})
.catch(err => {
  console.error("Erro na conexão:", err);
});

// Iniciando o servidor
const port = 4000;
app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`API rodando em http://localhost:${port}.`);
  }
});
