import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";
import Fazendas from "../models/Fazendas.js";

// Carrega as variáveis de ambiente
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/camarize";

async function testConnection() {
  try {
    console.log("🔍 Testando conexão com MongoDB...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Conexão com MongoDB estabelecida!");
    
    // Teste 1: Verificar se consegue salvar um usuário
    console.log("\n🧪 Teste 1: Criando usuário de teste...");
    const testUser = new User({
      nome: "Teste Debug",
      email: "teste@debug.com",
      senha: "123456",
      foto_perfil: null
    });
    
    const savedUser = await testUser.save();
    console.log("✅ Usuário salvo com sucesso:", savedUser._id);
    
    // Teste 2: Verificar se consegue salvar uma fazenda
    console.log("\n🧪 Teste 2: Criando fazenda de teste...");
    const testFazenda = new Fazendas({
      nome: "Fazenda Teste",
      rua: "Rua Teste",
      bairro: "Bairro Teste",
      cidade: "Cidade Teste",
      numero: 123
    });
    
    const savedFazenda = await testFazenda.save();
    console.log("✅ Fazenda salva com sucesso:", savedFazenda._id);
    
    // Teste 3: Verificar se consegue buscar o usuário
    console.log("\n🧪 Teste 3: Buscando usuário criado...");
    const foundUser = await User.findOne({ email: "teste@debug.com" });
    console.log("✅ Usuário encontrado:", foundUser ? "SIM" : "NÃO");
    
    // Teste 4: Verificar se consegue buscar a fazenda
    console.log("\n🧪 Teste 4: Buscando fazenda criada...");
    const foundFazenda = await Fazendas.findOne({ nome: "Fazenda Teste" });
    console.log("✅ Fazenda encontrada:", foundFazenda ? "SIM" : "NÃO");
    
    // Limpeza: remover dados de teste
    console.log("\n🧹 Limpando dados de teste...");
    await User.findByIdAndDelete(savedUser._id);
    await Fazendas.findByIdAndDelete(savedFazenda._id);
    console.log("✅ Dados de teste removidos!");
    
  } catch (error) {
    console.error("❌ Erro durante o teste:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão com MongoDB fechada.");
  }
}

testConnection(); 