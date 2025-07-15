import userService from "../services/userService.js";
import jwt from "jsonwebtoken";
import fazendaController from "./fazendaController.js";
import Sitios from "../models/Sitios.js";
// JWTSecret
const JWTSecret = "apigamessecret";

// Cadastrando um usuário
const createUser = async (req, res) => {
  try {
    console.log("Dados recebidos para cadastro:", req.body); // Log dos dados recebidos
    const { email, senha, foto_perfil, sitio } = req.body;
    const user = await userService.Create(nome, email, senha, foto_perfil, sitio);
    res.sendStatus(201); // Cod. 201 (CREATED)
  } catch (error) {
    console.log("Erro ao salvar usuário:", error); // Log do erro
    res.sendStatus(500); // Erro interno do servidor
  }
};

// Cadastro completo (usuário + sitio)
const register = async (req, res) => {
  try {
    const { nome, email, senha, foto_perfil, sitio } = req.body;
    let sitioDoc = null;
    if (sitio) {
      sitioDoc = new Sitios(sitio);
      await sitioDoc.save();
    }
    const user = await userService.Create(nome, email, senha, foto_perfil, sitioDoc ? sitioDoc._id : undefined);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Removido o método registerUser, pois não será mais usado

// Autenticando um usuário
const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;
    // Log dos dados recebidos
    console.log("Tentando login com:", email, senha);
    // Se o e-mail não está vazio
    if (email != undefined) {
      // Busca o usuário no banco
      const user = await userService.getOne(email);
      // Log do usuário encontrado
      console.log("Usuário encontrado:", user);
      // Usuário encontrado
      if (user != undefined) {
        // Senha correta
        if (user.senha == senha) {
          // Gerando o token
          jwt.sign(
            { id: user._id, email: user.email },
            JWTSecret,
            { expiresIn: "48h" },
            (error, token) => {
              if (error) {
                res.status(400).json({ error: "Erro ao gerar o token." }); // Bad request
              } else {
                res.status(200).json({ token: token });
              }
            });
          // Senha incorreta
        } else {
          res.status(401).json({ error: "Credenciais inválidas" }); // Unauthorized
        }
    // Usuário não encontrado
      } else {
        res.status(404).json({error: "Usuário não encontrado."}) //Not found
      }
      // E-mail inválido ou vazio
    } else {
        res.status(400).json({error: "O e-mail enviado é inválido."}) // Bad request
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // Erro interno do servidor
  }
};

export default { createUser, loginUser, JWTSecret, register };
